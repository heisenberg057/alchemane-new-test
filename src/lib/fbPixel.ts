export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export const pageView = () => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
};

export const trackEvent = (name: string, options: any = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', name, options);
  }
};

export const trackLead = (value: number = 0, currency: string = 'USD') => {
  trackEvent('Lead', {
    value,
    currency,
  });
};

export const trackContact = (type: string) => {
  trackEvent('Contact', {
    content_name: type,
  });
};

export const trackViewContent = (contentName: string, contentCategory?: string) => {
  trackEvent('ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
  });
};

export const trackSearch = (query: string) => {
  trackEvent('Search', {
    search_string: query,
  });
};
