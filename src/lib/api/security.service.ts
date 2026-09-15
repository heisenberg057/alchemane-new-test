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

export const securityService = {
  getSecurityLogs: async ({ page = 1, limit = 20, severity = '', eventType = '', startDate = '', endDate = '', search = '' }) => {
    const params: Record<string, string | number> = { page, limit };
    if (eventType) params.eventType = eventType;
    if (severity) params.eventLevel = severity;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (search) params.search = search;
    return handleResponse(apiClient.get('/security/logs/security', { params }));
  },

  getBlockedIPs: async () => {
    return handleResponse(apiClient.get('/security/blocked-ips'));
  },

  blockIP: async (ip: string, reason: string, durationMinutes: number) => {
    return handleResponse(apiClient.post('/security/block-ip', { ip, reason, durationMinutes }));
  },

  unblockIP: async (ip: string) => {
    return handleResponse(apiClient.post('/security/unblock-ip', { ip }));
  },
  
  getStats: async () => {
    return handleResponse(apiClient.get('/security/dashboard'));
  }
};
