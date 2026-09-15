import { apiClient } from './client';
import { parseSettingsFromPayload } from '@/lib/settings/parseSettingsPayload';

const handleResponse = (promise: Promise<any>) => {
  return promise
    .then(res => res.data)
    .catch(err => ({
      success: false,
      message: err.message || 'Operation failed',
      errors: err.errors || []
    }));
};

export const settingsService = {
  getSettings: async () => {
    const raw = await handleResponse(apiClient.get('/settings'));
    if (raw && typeof raw === 'object' && 'success' in raw && (raw as { success: boolean }).success === false) {
      return raw;
    }
    return parseSettingsFromPayload(raw);
  },

  updateSettings: async (data: any) => {
    return handleResponse(apiClient.patch('/settings', data));
  },
  
  getSecuritySettings: async () => {
    return handleResponse(apiClient.get('/security/settings')); // Assuming endpoint exists or is part of general settings
  }
};
