import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { BookingsQueryParams, BookingStatus } from '@/types';

export function useBookings(params: BookingsQueryParams = {}) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => api.getBookings(params),
  });
}

export function useBooking(id: string | null) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => api.getBooking(id!),
    enabled: !!id,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      mechanicId,
    }: {
      id: string;
      status: BookingStatus;
      mechanicId?: string;
    }) => api.updateBookingStatus(id, status, mechanicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
