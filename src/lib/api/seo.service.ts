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

export const seoService = {
  analyzePage: async (url: string) => {
    return handleResponse(apiClient.post('/seo/analyze', { url }));
  },

  getSeoReport: async (id: string) => {
    return handleResponse(apiClient.get(`/seo/report/${id}`));
  },

  getAiSuggestions: async (postId: number) => {
    return handleResponse(apiClient.post(`/ai-seo/suggest`, { postId }));
  },
  
  optimizePostForAi: async (id: number) => {
    return handleResponse(apiClient.post(`/ai-seo/optimize/${id}`));
  },
  
  testAiCitation: async (id: number, queries: string[]) => {
    return handleResponse(apiClient.post(`/ai-seo/test-citation/${id}`, { queries }));
  }
};
