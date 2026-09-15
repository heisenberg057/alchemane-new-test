import { apiClient } from "./client";

export interface PostFilters {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  confirmPhone?: string;
  city?: string;
  preferredTime?: string;
  consultationMode?: string;
  funnelSlug?: string;
  subject: string;
  message: string;
  formType?: "contact" | "consultation" | "callback" | "newsletter" | "comment";
  turnstileToken?: string;
  timeOnSite?: number;
  pagesBefore?: number;
  scrollDepth?: number;
  // Tracking
  sessionId?: string;
  campaignName?: string;
  adSetName?: string;
  adName?: string;
  campaignSource?: string;
  placement?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
  li_fat_id?: string;
}

export const api = {
  // Posts
  getPosts: async (filters: PostFilters = {}) => {
    const { data } = await apiClient.get("/posts", { params: filters });
    return data.data;
  },

  getPostBySlug: async (slug: string) => {
    const { data } = await apiClient.get(`/posts/slug/${slug}`);
    return data.data.post;
  },

  getPostById: async (id: number) => {
    const { data } = await apiClient.get(`/posts/${id}`);
    return data.data.post;
  },

  getRelatedPosts: async (slug: string) => {
    const { data } = await apiClient.get(`/posts/${slug}/related`);
    return data.data.posts;
  },

  createPost: async (payload: any) => {
    const { data } = await apiClient.post("/posts", payload);
    return data.data;
  },

  updatePost: async (id: number, payload: any) => {
    const { data } = await apiClient.put(`/posts/${id}`, payload);
    return data.data;
  },

  deletePost: async (id: number) => {
    const { data } = await apiClient.delete(`/posts/${id}`);
    return data.data;
  },

  // Products
  getProducts: async (filters: ProductFilters = {}) => {
    const { data } = await apiClient.get("/products", { params: filters });
    return data.data;
  },

  getProductBySlug: async (slug: string) => {
    const { data } = await apiClient.get("/products", { params: { slug, limit: 1 } });
    if (data.data.products.length > 0) return data.data.products[0];
    throw new Error("Product not found");
  },

  getProductById: async (id: number) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data.data.product;
  },

  // Forms
  submitContactForm: async (formData: ContactFormData) => {
    // Correcting the endpoint to match backend definition: /api/forms/submit
    const { data } = await apiClient.post("/forms/submit", formData);
    return data;
  },

  subscribeNewsletter: async (email: string, turnstileToken: string) => {
    const { data } = await apiClient.post("/forms/newsletter", {
      email,
      turnstileToken,
    });
    return data;
  },

  // Analytics
  getAnalytics: async (params: { from: Date; to: Date }) => {
    const { data } = await apiClient.get("/analytics/overview", {
      params: {
        startDate: params.from.toISOString(),
        endDate: params.to.toISOString(),
      },
    });
    return data.data;
  },

  trackPageView: async (path: string) => {
    apiClient.post("/analytics/pageview", { path }).catch(() => { });
  },

  trackAdClick: async (payload: any) => {
    const { data } = await apiClient.post("/tracking/click", payload);
    return data;
  },

  trackConversion: async (payload: any) => {
    const { data } = await apiClient.post("/tracking/conversion", payload);
    return data;
  },

  // Webhooks
  getWebhooks: async () => {
    const { data } = await apiClient.get("/webhooks");
    return data.data;
  },

  getWebhook: async (id: string) => {
    const { data } = await apiClient.get(`/webhooks/${id}`);
    return data.data;
  },

  createWebhook: async (payload: any) => {
    const { data } = await apiClient.post("/webhooks", payload);
    return data.data;
  },

  updateWebhook: async (id: string, payload: any) => {
    const { data } = await apiClient.put(`/webhooks/${id}`, payload);
    return data.data;
  },

  deleteWebhook: async (id: string) => {
    const { data } = await apiClient.delete(`/webhooks/${id}`);
    return data;
  },

  testWebhook: async (id: string) => {
    const { data } = await apiClient.post(`/webhooks/${id}/test`);
    return data.data;
  },

  getWebhookLogs: async (id: string) => {
    const { data } = await apiClient.get(`/webhooks/${id}/logs`);
    return data.data;
  },

  getWebhookEvents: async () => {
    const { data } = await apiClient.get("/webhooks/events");
    return data.data;
  },

  getIntegrationPresets: async () => {
    const { data } = await apiClient.get("/webhooks/presets");
    return data.data;
  },

  retryWebhookLog: async (logId: string) => {
    const { data } = await apiClient.post(`/webhooks/logs/${logId}/retry`);
    return data;
  },

  // SEO
  getSeoHealth: async () => {
    const { data } = await apiClient.get("/search-optimization/health");
    return data.data as import("@/app/api/search-optimization/health/route").SeoHealthStatus;
  },

  getSeoOverview: async (contentType?: import("@/app/api/search-optimization/overview/route").ContentScope) => {
    const params = contentType ? { contentType } : {};
    const { data } = await apiClient.get("/search-optimization/overview", { params });
    return data.data;
  },

  runBulkSeoAnalysis: async () => {
    const { data } = await apiClient.post("/search-optimization/analyze-all");
    return data.data;
  },

  analyzePost: async (id: number) => {
    const { data } = await apiClient.post(`/search-optimization/analyze/${id}`);
    return data.data;
  },

  getSeoAnalysis: async (id: number) => {
    const { data } = await apiClient.get(`/search-optimization/analysis/${id}`);
    return data.data;
  },

  generateSchema: async (id: number) => {
    const { data } = await apiClient.post(`/search-optimization/schema/${id}`);
    return data.data;
  },

  getLinkSuggestions: async (id: number) => {
    const { data } = await apiClient.get(`/search-optimization/links/suggestions/${id}`);
    return data.data;
  },

  createInternalLink: async (payload: any) => {
    const { data } = await apiClient.post("/search-optimization/links", payload);
    return data.data;
  },

  trackKeyword: async (payload: any) => {
    const { data } = await apiClient.post("/search-optimization/keywords/track", payload);
    return data.data;
  },

  getTrackedKeywords: async () => {
    const { data } = await apiClient.get("/search-optimization/keywords");
    return data.data;
  },

  getKeywordHistory: async (keyword: string) => {
    const { data } = await apiClient.get(`/search-optimization/keywords/${keyword}/history`);
    return data.data;
  },

  // AI SEO
  optimizePostForAi: async (id: number) => {
    const { data } = await apiClient.post(`/ai-seo/optimize/${id}`);
    return data.data;
  },

  testAiCitation: async (id: number, queries?: string[]) => {
    const { data } = await apiClient.post(`/ai-seo/test-citation/${id}`, { queries });
    return data.data;
  },

  getAiDashboard: async () => {
    const { data } = await apiClient.get("/ai-seo/dashboard");
    return data.data;
  },

  getCitationHistory: async (id: number) => {
    const { data } = await apiClient.get(`/ai-seo/citation-history/${id}`);
    return data.data;
  },

  analyzeDraft: async (payload: any) => {
    // Keep using general SEO controller for this if needed, or move to AI SEO
    const { data } = await apiClient.post("/search-optimization/analyze-draft", payload);
    return data.data;
  },

  autosavePost: async (id: number, payload: { blocksData?: string; content?: string }) => {
    const { data } = await apiClient.patch(`/posts/${id}/autosave`, payload);
    return data.data;
  },

  // Lead Scoring
  getHotLeads: async (limit: number = 10) => {
    const { data } = await apiClient.get("/lead-scoring/hot-leads", { params: { limit } });
    const body = data.data as { leads?: unknown[] } | unknown[] | undefined;
    if (Array.isArray(body)) {
      return body;
    }
    if (body && typeof body === "object" && Array.isArray((body as { leads?: unknown[] }).leads)) {
      return (body as { leads: unknown[] }).leads;
    }
    return [];
  },

  getLeadScore: async (formSubmissionId: number) => {
    const { data } = await apiClient.get(`/lead-scoring/score/${formSubmissionId}`);
    return data.data;
  },

  scoreLead: async (formSubmissionId: number) => {
    const { data } = await apiClient.post(`/lead-scoring/score/${formSubmissionId}`);
    return data.data;
  },

  bulkScoreLeads: async () => {
    const { data } = await apiClient.post("/lead-scoring/score-all");
    return data.data;
  },

  trackEvent: async (payload: any) => {
    const { data } = await apiClient.post("/lead-scoring/track/event", payload);
    return data.data;
  },

  recordExitIntent: async (data: any) => {
    return apiClient.post("/lead-scoring/track/exit-intent", data);
  },

  trackAbandonment: async (payload: any) => {
    const { data } = await apiClient.post("/lead-scoring/track/abandonment", payload);
    return data.data;
  },

  // Calculator
  calculateCost: async (payload: any) => {
    const { data } = await apiClient.post("/calculator/cost", payload);
    return data.data;
  },

  estimateGraftsWithAi: async (description: string) => {
    const { data } = await apiClient.post("/calculator/estimate-grafts", { description });
    return data.data;
  },

  saveCalculatorUsage: async (payload: any) => {
    const { data } = await apiClient.post("/calculator/save", payload);
    return data.data;
  },

  // Behavioral & Conversion
  trackBehavioralTrigger: async (payload: any) => {
    const { data } = await apiClient.post("/lead-optimization/track/trigger", payload);
    return data.data;
  },

  getTriggerRules: async (page: string, behavior: any) => {
    try {
      const { data } = await apiClient.post("/lead-optimization/triggers/rules", behavior, { params: { page } });
      return data.data;
    } catch (err: any) {
      // Gracefully handle network errors so they don't break admin pages
      console.warn("getTriggerRules network error:", err?.message || err);
      return { rules: [] };
    }
  },

  trackConversionEvent: async (payload: any) => {
    const { data } = await apiClient.post("/lead-optimization/track/conversion", payload);
    return data.data;
  },

  getOptimizationDashboard: async (days: number = 30) => {
    const { data } = await apiClient.get("/lead-optimization/dashboard", { params: { days } });
    return data.data;
  },

  getExitIntentContent: async (page: string, device: string) => {
    const { data } = await apiClient.get("/lead-optimization/exit-intent/content", { params: { page, device } });
    return data.data;
  },
};
