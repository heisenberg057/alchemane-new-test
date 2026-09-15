import { apiClient } from './client';

const handleResponse = (promise: Promise<any>) => {
  return promise
    .then(res => res.data)
    .catch(err => ({
      success: false,
      message: err.message || 'Operation failed',
      errors: err.errors || []
    }));
};

export const leadsService = {
  getLeads: async ({ page = 1, limit = 20, search = '', status = '' }) => {
    return handleResponse(
      apiClient.get('/lead-scoring/hot-leads', {
        params: { page, limit, search, status, threshold: 0 },
      })
    );
  },

  getLead: async (id: number) => {
    return handleResponse(apiClient.get(`/lead-scoring/score/${id}`));
  },

  updateLeadStatus: async (id: number | string, status: string) => {
    return handleResponse(
      apiClient.patch(`/form-submissions/${id}`, { status: status })
    );
  },

  trackEvent: async (eventData: any) => {
    return handleResponse(apiClient.post('/lead-scoring/track/event', eventData));
  },
  
  trackExitIntent: async (data: any) => {
    return handleResponse(apiClient.post('/lead-scoring/track/exit-intent', data));
  }
};
