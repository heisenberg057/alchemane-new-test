import { apiClient } from "./api/client";
import { trackLead, trackContact } from "./fbPixel";

export interface UTMParameters {
  campaignName?: string | null;
  adSetName?: string | null;
  adName?: string | null;
  campaignSource?: string | null;
  placement?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  msclkid?: string | null;
  ttclid?: string | null;
  li_fat_id?: string | null;
}

export interface AdClickResponse {
  success: boolean;
  data: {
    sessionId: string;
    trackingId: number;
  };
}

const STORAGE_KEY = 'tracking_utm_params';
const SESSION_KEY = 'tracking_session_id';
const EXPIRY_DAYS = 30;

/**
 * Capture UTM parameters from URL and store them
 */
export const captureUTMParameters = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    let hasUTMs = false;

    // Create a case-insensitive map of all URL parameters
    const urlParamsLower = new Map<string, string>();
    searchParams.forEach((value, key) => {
      urlParamsLower.set(key.toLowerCase(), value);
    });

    // Mapping from expected camelCase key to the possible URL param names (lowercased for matching)
    const keyMappings: Record<string, string[]> = {
      utmSource: ['utm_source'],
      utmMedium: ['utm_medium'],
      utmCampaign: ['utm_campaign', 'campaignname'],
      utmContent: ['utm_content'],
      utmTerm: ['utm_term', 'adname'],
      campaignName: ['campaignname', 'utm_campaign'],
      adSetName: ['adsetname'],
      adName: ['adname', 'utm_term'],
      campaignSource: ['campaignsource', 'utm_source'],
      placement: ['placement'],
      gclid: ['gclid'],
      fbclid: ['fbclid'],
      msclkid: ['msclkid'],
      ttclid: ['ttclid'],
      li_fat_id: ['li_fat_id']
    };

    Object.entries(keyMappings).forEach(([camelKey, urlMatches]) => {
      // Find the first matching parameter that has a value
      for (const match of urlMatches) {
        if (urlParamsLower.has(match)) {
          params[camelKey] = urlParamsLower.get(match)!;
          hasUTMs = true;
          break; // only take the first match
        }
      }
    });

    // If no new UTMs, check if we have stored ones
    if (!hasUTMs) {
      const stored = getStoredUTMParameters();
      if (stored) return getSessionId();
    }

    // Store in localStorage with timestamp
    if (hasUTMs) {
      const data = {
        params,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Send to backend to track click - slightly offset to avoid concurrent lockouts
    await new Promise(resolve => setTimeout(resolve, 500));
    const payload = {
      ...params,
      landingPage: window.location.href,
      referrer: document.referrer,
      sessionId: getSessionId() || undefined
    };

    const { data } = await apiClient.post<AdClickResponse>('/tracking/click', payload);
    
    if (data.success && data.data.sessionId) {
      localStorage.setItem(SESSION_KEY, data.data.sessionId);
      return data.data.sessionId;
    }

    return null;
  } catch (error) {
    console.error('Failed to capture UTM parameters:', error);
    return null;
  }
};

/**
 * Get stored UTM parameters from localStorage
 */
export const getStoredUTMParameters = (): UTMParameters => {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const { params, timestamp } = JSON.parse(stored);
    
    // Check expiry
    const now = new Date().getTime();
    const expiryTime = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    
    if (now - timestamp > expiryTime) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }

    return params;
  } catch (error) {
    return {};
  }
};

/**
 * Get Session ID from localStorage
 */
export const getSessionId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
};

/**
 * Track Conversion
 */
export const trackConversion = async (
  conversionType: string, 
  conversionValue?: number,
  metadata?: Record<string, any>
) => {
  // Track Facebook Pixel Event
  if (conversionType === 'form_submission') {
    trackLead(conversionValue);
  } else if (conversionType === 'phone_click') {
    trackContact('Phone');
  }

  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    await apiClient.post('/tracking/conversion', {
      sessionId,
      conversionType,
      conversionValue,
      metadata
    });
  } catch (error) {
    console.error('Failed to track conversion:', error);
  }
};
