import 'dotenv/config';
import http from 'node:http';
import { app } from './app.js';
import { setupSocket } from './sockets/index.js';
import { startStatusTransitionWorker } from './jobs/statusTransition.js';
import { prisma } from './lib/prisma.js';
import { redis } from './lib/redis.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

// ── Create HTTP Server ───────────────────────────────────────────────────────

const httpServer = http.createServer(app);

// ── Attach Socket.IO ─────────────────────────────────────────────────────────

const io = setupSocket(httpServer);
app.set('io', io);

// ── Start BullMQ Worker ──────────────────────────────────────────────────────

const { worker, queue } = startStatusTransitionWorker(io);

// ── Start Listening ──────────────────────────────────────────────────────────

httpServer.listen(PORT, () => {
  console.log(`
  ┌────────────────────────────────────────────┐
  │                                            │
  │   🔧  Instant Mechanic API                │
  │   🌐  http://localhost:${PORT}              │
  │   📚  http://localhost:${PORT}/api/docs     │
  │                                            │
  └────────────────────────────────────────────┘
  `);
});

// ── Graceful Shutdown ────────────────────────────────────────────────────────

async function shutdown(signal: string) {
  console.log(`\n${signal} received — shutting down gracefully...`);

  // Stop accepting new connections
  httpServer.close();

  // Close BullMQ worker & queue
  await worker.close();
  await queue.close();

  // Close Socket.IO
  io.close();

  // Disconnect data stores
  await redis.quit();
  await prisma.$disconnect();

  console.log('✅ Shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
