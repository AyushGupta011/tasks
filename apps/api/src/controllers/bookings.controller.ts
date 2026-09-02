import { Request, Response } from 'express';
import * as bookingsService from '../services/bookings.service.js';

export async function listBookings(req: Request, res: Response) {
  const result = await bookingsService.listBookings(req.query as any);
  res.json(result);
}

export async function getBooking(req: Request, res: Response) {
  const booking = await bookingsService.getBookingById(req.params.id as string);
  res.json({ data: booking });
}

export async function updateBookingStatus(req: Request, res: Response) {
  const { status, mechanicId } = req.body;
  const booking = await bookingsService.updateBookingStatus(req.params.id as string, status, mechanicId);

  // Emit via socket.io (attached to req by server setup)
  const io = req.app.get('io');
  if (io) {
    io.emit('booking:updated', booking);
  }

  res.json({ data: booking });
}
