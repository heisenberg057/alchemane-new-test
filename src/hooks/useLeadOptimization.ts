import { useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { api } from '@/lib/api/endpoints';

export interface LeadOptimizationState {
  sessionId: string;
  timeOnSite: number;
  pagesBefore: number;
  scrollDepth: number;
}

export const useLeadOptimization = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [timeOnSite, setTimeOnSite] = useState<number>(0);
  const [pagesBefore, setPagesBefore] = useState<number>(0);
  const [scrollDepth, setScrollDepth] = useState<number>(0);
  
  // Timer ref
  const startTimeRef = useRef<number>(Date.now());

  // Initialize session
  useEffect(() => {
    // Get or create session ID - Align with UTM tracker
    let storedSessionId = localStorage.getItem('tracking_session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('tracking_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Track pages visited
    const pages = parseInt(localStorage.getItem('ah_pages_viewed') || '0');
    localStorage.setItem('ah_pages_viewed', (pages + 1).toString());
    setPagesBefore(pages);

    // Timer for time on site (across pages roughly, but for this session we track current page time + stored total)
    // For simplicity, we'll just track time on CURRENT page for the API payload, 
    // or we could store a timestamp of first visit.
    const firstVisit = localStorage.getItem('ah_first_visit');
    if (!firstVisit) {
      localStorage.setItem('ah_first_visit', Date.now().toString());
    }
    
    // Scroll tracker
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      if (scrollPercent > scrollDepth) {
        setScrollDepth(parseFloat(scrollPercent.toFixed(2)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Interval for time on site
    const interval = setInterval(() => {
      const start = parseInt(localStorage.getItem('ah_first_visit') || Date.now().toString());
      const now = Date.now();
      setTimeOnSite(Math.floor((now - start) / 1000));
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track Form Abandonment
  const trackAbandonment = useCallback(async (data: any) => {
    if (!sessionId) return;
    
    try {
      await api.trackAbandonment({
        sessionId,
        ...data,
        timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
        scrollDepth
      });
    } catch (error: any) {
      // Non-critical analytics — avoid noisy console errors when DB/API is unavailable
      if (
        error?.status === 0 ||
        error?.message === 'Network Error' ||
        error?.message === 'Internal server error'
      ) {
        return;
      }
      console.error('Failed to track abandonment', error?.message || error);
    }
  }, [sessionId, scrollDepth]);

  // Track Conversion Event
  const trackEvent = useCallback(async (eventType: string, eventData?: any, formType?: string) => {
    if (!sessionId) return;

    try {
      await api.trackConversionEvent({
        sessionId,
        eventType,
        eventData,
        page: window.location.pathname,
        formType
      });
    } catch (error: any) {
      if (
        error?.status === 0 ||
        error?.message === 'Network Error' ||
        error?.message === 'Internal server error'
      ) {
        return;
      }
      console.error('Failed to track event', error?.message || error);
    }
  }, [sessionId]);

  // Track Trigger
  const trackTrigger = useCallback(async (triggerType: string, triggerValue: any, actionType: string, actionContent?: string, converted: boolean = false) => {
    if (!sessionId) return;

    try {
      await api.trackBehavioralTrigger({
        sessionId,
        triggerType,
        triggerValue,
        actionType,
        actionContent,
        converted,
        page: window.location.pathname,
        device: window.innerWidth < 768 ? 'mobile' : 'desktop'
      });
    } catch (error: any) {
      if (
        error?.status === 0 ||
        error?.message === 'Network Error' ||
        error?.message === 'Internal server error'
      ) {
        return;
      }
      console.error('Failed to track trigger', error?.message || error);
    }
  }, [sessionId]);

  // Get Calculator Data
  const getCalculatorData = useCallback(() => {
    const data = localStorage.getItem('ah_calculator_data');
    return data ? JSON.parse(data) : null;
  }, []);

  return {
    sessionId,
    timeOnSite,
    pagesBefore,
    scrollDepth,
    trackAbandonment,
    trackEvent,
    trackTrigger,
    getCalculatorData
  };
};
