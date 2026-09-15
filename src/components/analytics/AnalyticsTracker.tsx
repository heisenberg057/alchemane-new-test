'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';
import { api } from '@/lib/api/endpoints';

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasTracked = useRef<string | null>(null);

  useEffect(() => {
    // Skip tracking for admin routes
    if (pathname?.startsWith('/admin')) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Prevent React 18 strict mode double-firing from deadlocking SQLite backend
    if (hasTracked.current === url) return;
    hasTracked.current = url;

    // Call our internal API/Backend to track (staggered to prevent SQLite lockouts)
    const timer = setTimeout(() => {
      api.trackPageView(url);
    }, 2000);

    // If Google Analytics is present
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
