import { Queue, Worker } from 'bullmq';
import { Server } from 'socket.io';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import { BookingStatus, MechanicStatus } from '@prisma/client';
import { STATUS_CHAIN } from '../types/index.js';
import { emitBookingUpdate } from '../sockets/index.js';

const QUEUE_NAME = 'booking-status-transition';
const REPEAT_INTERVAL_MS = 12_000;

export function startStatusTransitionWorker(io: Server) {
  const connection = {
    host: redis.options.host || 'localhost',
    port: redis.options.port || 6379,
    password: redis.options.password as string | undefined,
    maxRetriesPerRequest: null,
  };

  const queue = new Queue(QUEUE_NAME, { connection });

  // Register the repeatable job (idempotent — won't duplicate if already exists)
  queue.upsertJobScheduler(
    'auto-advance-bookings',
    { every: REPEAT_INTERVAL_MS },
    { name: 'advance', data: {} }
  );

  const worker = new Worker(
    QUEUE_NAME,
    async () => {
      try {
        await advanceBookings(io);
      } catch (err) {
        console.error('Status transition worker error:', err);
      }
    },
    { connection, concurrency: 1 }
  );

  worker.on('error', (err) => {
    console.error('BullMQ worker error:', err.message);
  });

  console.log('🔄 Status transition worker started (every 12s)');

  return { queue, worker };
}

/**
 * Core logic: pick random transitional bookings and advance them one step.
 */
async function advanceBookings(io: Server): Promise<void> {
  // Transitional states (everything except terminal COMPLETED and CANCELLED)
  const transitionalStatuses = STATUS_CHAIN.slice(0, -1); // PENDING → IN_PROGRESS

  const candidates = await prisma.booking.findMany({
    where: { status: { in: transitionalStatuses } },
    select: { id: true, status: true, mechanicId: true },
    take: 50, // pool to pick from
  });

  if (candidates.length === 0) return;

  // Pick 1–3 random bookings
  const count = Math.min(
    Math.floor(Math.random() * 3) + 1,
    candidates.length
  );
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  for (const booking of selected) {
    const currentIdx = STATUS_CHAIN.indexOf(booking.status);
    if (currentIdx === -1 || currentIdx >= STATUS_CHAIN.length - 1) continue;

    const nextStatus = STATUS_CHAIN[currentIdx + 1]!;

    try {
      // If advancing to ASSIGNED and no mechanic, find one
      let mechanicId = booking.mechanicId;
      if (nextStatus === BookingStatus.ASSIGNED && !mechanicId) {
        const availableMechanic = await prisma.mechanic.findFirst({
          where: { status: MechanicStatus.AVAILABLE },
          select: { id: true },
          orderBy: { jobsCompleted: 'asc' }, // Prefer less-busy mechanics
        });

        if (!availableMechanic) {
          // No available mechanic — skip this booking
          continue;
        }
        mechanicId = availableMechanic.id;
      }

      // Update the booking status
      const updateData: any = { status: nextStatus };
      if (mechanicId && !booking.mechanicId) {
        updateData.mechanic = { connect: { id: mechanicId } };
      }
      if (nextStatus === BookingStatus.COMPLETED) {
        updateData.completedAt = new Date();
      }

      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: updateData,
        include: {
          customer: { select: { id: true, name: true, email: true, phone: true } },
          mechanic: { select: { id: true, name: true, phone: true, status: true } },
          serviceCategory: { select: { id: true, name: true } },
        },
      });

      // Update mechanic status
      if (updated.mechanicId) {
        if (nextStatus === BookingStatus.COMPLETED) {
          await prisma.mechanic.update({
            where: { id: updated.mechanicId },
            data: {
              status: MechanicStatus.AVAILABLE,
              jobsCompleted: { increment: 1 },
            },
          });
        } else if (
          nextStatus === BookingStatus.ASSIGNED ||
          nextStatus === BookingStatus.MECHANIC_ON_THE_WAY ||
          nextStatus === BookingStatus.IN_PROGRESS
        ) {
          await prisma.mechanic.update({
            where: { id: updated.mechanicId },
            data: { status: MechanicStatus.ON_JOB },
          });
        }
      }

      // Emit real-time update
      emitBookingUpdate(io, { ...updated, amount: Number(updated.amount) });

      console.log(`📋 Booking ${booking.id.slice(0, 8)}… ${booking.status} → ${nextStatus}`);
    } catch (err) {
      console.error(`Failed to advance booking ${booking.id}:`, err);
    }
  }
}
