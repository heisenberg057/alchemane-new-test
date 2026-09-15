import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formsService } from '../api/forms.service';

export const useSubmitForm = (formType: 'contact' | 'calculator' = 'contact') => {
  return useMutation({
    mutationFn: (data: any) => {
      if (formType === 'calculator') {
        return formsService.submitCalculatorForm(data);
      }
      return formsService.submitContactForm(data);
    }
  });
};

export const useGetSubmissions = (filters: any = {}) => {
  return useQuery({
    queryKey: ['submissions', filters],
    queryFn: async () => {
      const res = await formsService.getFormSubmissions(filters);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch submissions');
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: formsService.deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      formsService.updateSubmission(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
};
