'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const FloatingContactWidget = dynamic(
  () => import('@/components/FloatingContactWidget').then((m) => ({ default: m.FloatingContactWidget })),
  { ssr: false }
);

export function DeferredFloatingContactWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) setReady(true);
    };
    const ric = globalThis.requestIdleCallback;
    if (typeof ric === 'function') {
      const id = ric.call(globalThis, run, { timeout: 2800 });
      return () => {
        cancelled = true;
        globalThis.cancelIdleCallback?.(id);
      };
    }
    const t = globalThis.setTimeout(run, 1800);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(t);
    };
  }, []);

  if (!ready) return null;
  return <FloatingContactWidget />;
}
