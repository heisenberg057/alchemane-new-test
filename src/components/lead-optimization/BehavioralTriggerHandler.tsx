'use client';

import { useEffect, useRef } from 'react';
import { useLeadOptimization } from '@/hooks/useLeadOptimization';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api/endpoints';
import { useToast } from '@/components/ui/use-toast';

export const BehavioralTriggerHandler = () => {
  const { sessionId, timeOnSite, scrollDepth, pagesBefore, trackTrigger } = useLeadOptimization();
  const pathname = usePathname();
  const { toast } = useToast();

  // Keep a ref so the interval callback always reads the latest values without
  // needing them as effect dependencies (avoids resetting the interval on every
  // scroll/time tick).
  const latestRef = useRef({ timeOnSite, scrollDepth, pagesBefore, pathname, toast, trackTrigger });
  useEffect(() => {
    latestRef.current = { timeOnSite, scrollDepth, pagesBefore, pathname, toast, trackTrigger };
  }, [timeOnSite, scrollDepth, pagesBefore, pathname, toast, trackTrigger]);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    if (!sessionId) return;
    const checkRules = async () => {
      const latestData = latestRef.current;
      try {
        const rules = await api.getTriggerRules(latestData.pathname || '/', {
          timeOnPage: latestData.timeOnSite,
          scrollDepth: latestData.scrollDepth,
          pageCount: latestData.pagesBefore
        });

        if (rules && rules.length > 0) {
          rules.forEach((rule: any) => {
            const key = `ah_trigger_${rule.triggerType}_${latestData.pathname}`;
            if (sessionStorage.getItem(key)) return;

            if (rule.actionType === 'show_popup' || rule.actionType === 'show_chat') {
              latestData.toast({
                title: "Suggestion",
                description: rule.message,
                duration: 10000,
              });
            }

            latestData.trackTrigger(rule.triggerType, rule.triggerValue, rule.actionType, rule.actionContent, false);
            sessionStorage.setItem(key, 'true');
          });
        }
      } catch (error) {
        console.error('Failed to check trigger rules', error);
      }
    };

    const interval = setInterval(checkRules, 10000);
    return () => clearInterval(interval);
  }, [sessionId, pathname]);

  // Check once on significant scroll — fires only when scrollDepth or pathname changes
  useEffect(() => {
    const { pathname: currentPathname } = latestRef.current;
    if (currentPathname?.startsWith('/admin')) return;

    const scrollKey = `ah_scroll_check_${currentPathname}`;
    if (scrollDepth > 0.5 && !sessionStorage.getItem(scrollKey)) {
      sessionStorage.setItem(scrollKey, 'true');

      const checkRules = async () => {
        const latest = latestRef.current;
        try {
          const rules = await api.getTriggerRules(latest.pathname || '/', {
            timeOnPage: latest.timeOnSite,
            scrollDepth: latest.scrollDepth,
            pageCount: latest.pagesBefore,
          });

          if (rules && rules.length > 0) {
            rules.forEach((rule: any) => {
              const key = `ah_trigger_${rule.triggerType}_${latest.pathname}`;
              if (sessionStorage.getItem(key)) return;

              if (rule.actionType === 'show_popup' || rule.actionType === 'show_chat') {
                latest.toast({
                  title: "Suggestion",
                  description: rule.message,
                  duration: 10000,
                });
              }

              latest.trackTrigger(rule.triggerType, rule.triggerValue, rule.actionType, rule.actionContent, false);
              sessionStorage.setItem(key, 'true');
            });
          }
        } catch (error) {
          console.error('Check rules error on scroll', error);
        }
      };
      checkRules();
    }
  }, [scrollDepth, pathname]);

  return null;
};
