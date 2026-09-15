import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '../api/leads.service';

export const useLeads = (filters: any = {}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const res = (await leadsService.getLeads(filters)) as {
        success?: boolean;
        message?: string;
        data?: { leads?: unknown[]; meta?: Record<string, unknown> };
      };
      if (res?.success === false) {
        throw new Error(res.message || 'Failed to fetch leads');
      }
      const payload = res?.data;
      if (payload?.leads && payload.meta) {
        return { leads: payload.leads, meta: payload.meta };
      }
      return { leads: [], meta: { total: 0, pages: 1, page: 1, limit: 20 } };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useLead = (id: number) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await leadsService.getLead(id);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch lead');
      }
      return res.data;
    },
    enabled: !!id,
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      leadsService.updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};
