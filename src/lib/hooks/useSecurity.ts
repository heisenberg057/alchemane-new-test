import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { securityService } from '../api/security.service';

export const useSecurityLogs = (filters: any = {}) => {
  return useQuery({
    queryKey: ['security-logs', filters],
    queryFn: async () => {
      const res = await securityService.getSecurityLogs(filters);
      return res?.data || { logs: [], meta: { total: 0, pages: 1 } };
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto refresh
  });
};

export const useBlockedIPs = () => {
  return useQuery({
    queryKey: ['blocked-ips'],
    queryFn: async () => {
      const res = await securityService.getBlockedIPs();
      return res?.data || [];
    },
  });
};

export const useSecurityStats = () => {
  return useQuery({
    queryKey: ['security-stats'],
    queryFn: async () => {
      const res = await securityService.getStats();
      return res?.data || {};
    },
    refetchInterval: 60 * 1000,
  });
};

export const useBlockIP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ip, reason, duration }: { ip: string; reason: string; duration: number }) => 
      securityService.blockIP(ip, reason, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
      queryClient.invalidateQueries({ queryKey: ['security-logs'] });
    }
  });
};

export const useUnblockIP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ip }: { ip: string }) => securityService.unblockIP(ip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
    }
  });
};
