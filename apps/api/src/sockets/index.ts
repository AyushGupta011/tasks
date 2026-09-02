import { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';

export function setupSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.emit('connection:ack', {
      message: 'Connected to Instant Mechanic real-time server',
      socketId: socket.id,
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

/**
 * Helper to emit a booking update to all connected clients.
 */
export function emitBookingUpdate(io: Server, booking: unknown): void {
  io.emit('booking:updated', booking);
}
