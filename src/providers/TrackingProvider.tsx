'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { captureUTMParameters, getSessionId, trackConversion as apiTrackConversion } from '@/lib/tracking';

interface TrackingContextType {
  sessionId: string | null;
  trackConversion: (type: string, value?: number, metadata?: any) => Promise<void>;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const hasInitialized = React.useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const initTracking = async () => {
      const id = await captureUTMParameters();
      if (id) setSessionId(id);
      else setSessionId(getSessionId());
    };

    initTracking();
  }, []);

  const trackConversion = async (type: string, value?: number, metadata?: any) => {
    await apiTrackConversion(type, value, metadata);
  };

  return (
    <TrackingContext.Provider value={{ sessionId, trackConversion }}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}
