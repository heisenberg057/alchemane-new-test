'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'alchemane-countdown-deadline';
const WINDOW_MS = 10 * 60 * 60 * 1000; // 10 hour rolling offer window

const pad = (n: number) => String(n).padStart(2, '0');

function readDeadline(): number {
  try {
    const stored = Number(sessionStorage.getItem(STORAGE_KEY));
    if (stored && stored > Date.now()) return stored;
  } catch {
    /* ignore */
  }
  const next = Date.now() + WINDOW_MS;
  try {
    sessionStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    /* ignore */
  }
  return next;
}

/** Rolling countdown, persisted per-tab, matching the original offer-panel behaviour. */
export function useCountdown() {
  const [time, setTime] = useState({ hours: '09', minutes: '52', seconds: '18' });

  useEffect(() => {
    let deadline = readDeadline();

    const tick = () => {
      const remaining = Math.max(0, deadline - Date.now());
      const hours = Math.floor(remaining / 3_600_000);
      const minutes = Math.floor((remaining % 3_600_000) / 60_000);
      const seconds = Math.floor((remaining % 60_000) / 1000);
      setTime({ hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) });
      if (remaining <= 0) {
        deadline = Date.now() + WINDOW_MS;
        try {
          sessionStorage.setItem(STORAGE_KEY, String(deadline));
        } catch {
          /* ignore */
        }
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}
