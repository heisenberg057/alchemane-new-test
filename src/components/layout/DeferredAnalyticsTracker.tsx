'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const AnalyticsTracker = dynamic(
  () => import('@/components/analytics/AnalyticsTracker').then((m) => ({ default: m.AnalyticsTracker })),
  { ssr: false }
);

export function DeferredAnalyticsTracker() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const ric = globalThis.requestIdleCallback;
    if (typeof ric === 'function') {
      const id = ric(
        () => {
          setMount(true);
        },
        { timeout: 4000 }
      );
      return () => {
        globalThis.cancelIdleCallback?.(id);
      };
    }
    const t = globalThis.setTimeout(() => setMount(true), 1600);
    return () => globalThis.clearTimeout(t);
  }, []);

  if (!mount) return null;
  return <AnalyticsTracker />;
}
