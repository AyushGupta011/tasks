import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useDashboard(days: number = 30) {
  return useQuery({
    queryKey: ['dashboard', days],
    queryFn: () => api.getDashboardStats(days),
    staleTime: 30 * 1000,
  });
}
