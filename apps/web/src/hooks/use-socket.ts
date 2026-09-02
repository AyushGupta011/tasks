'use client';

import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import type { Booking } from '@/types';

export function useSocket() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<Booking | null>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onBookingUpdated(booking: Booking) {
      setLastEvent(booking);

      // Invalidate relevant query caches so UI refreshes
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['mechanics'] });

      // Also invalidate the specific booking if cached
      queryClient.invalidateQueries({ queryKey: ['booking', booking.id] });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('booking:updated', onBookingUpdated);

    // If already connected
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('booking:updated', onBookingUpdated);
    };
  }, [queryClient]);

  return { isConnected, lastEvent };
}
