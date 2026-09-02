import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { MechanicStatus } from '@/types';

export function useMechanics(status?: MechanicStatus) {
  return useQuery({
    queryKey: ['mechanics', status],
    queryFn: () => api.getMechanics(status),
  });
}

export function useMechanic(id: string | null) {
  return useQuery({
    queryKey: ['mechanic', id],
    queryFn: () => api.getMechanic(id!),
    enabled: !!id,
  });
}
