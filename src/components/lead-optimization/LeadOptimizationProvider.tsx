'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const BehavioralTriggerHandler = dynamic(
  () => import('./BehavioralTriggerHandler').then((m) => ({ default: m.BehavioralTriggerHandler })),
  { ssr: false }
);

export const LeadOptimizationProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [deferTriggers, setDeferTriggers] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return undefined;
    let cancelled = false;
    const run = () => {
      if (!cancelled) setDeferTriggers(true);
    };
    const ric = globalThis.requestIdleCallback;
    if (typeof ric === 'function') {
      const id = ric.call(globalThis, run, { timeout: 3200 });
      return () => {
        cancelled = true;
        globalThis.cancelIdleCallback?.(id);
      };
    }
    const t = globalThis.setTimeout(run, 2200);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(t);
    };
  }, [pathname]);

  // Don't run lead optimization polling on admin, standalone funnel, or Alchemane routes.
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/lp') ||
    pathname?.startsWith('/alchemane') ||
    pathname?.startsWith('/permanent-extensions') ||
    pathname?.startsWith('/toppers') ||
    pathname?.startsWith('/wigs')
  ) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {deferTriggers ? <BehavioralTriggerHandler /> : null}
    </>
  );
};
