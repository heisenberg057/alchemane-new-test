/** Simplified from behavioralTrigger.service.js */

export type BehaviorInput = {
  timeOnPage?: number;
  scrollDepth?: number;
  pageViews?: number;
};

export function getTriggerRulesForBehavior(
  _page: string,
  userBehavior: BehaviorInput
): { rules: unknown[] } {
  const rules: unknown[] = [];

  if ((userBehavior.timeOnPage ?? 0) > 120) {
    rules.push({
      triggerType: "time_on_page",
      triggerValue: userBehavior.timeOnPage,
      actionType: "show_popup",
      actionContent: "limited_offer",
      priority: "high",
      message: "Still reading? Get 10% off your consultation!",
    });
  }

  if ((userBehavior.scrollDepth ?? 0) > 0.75) {
    rules.push({
      triggerType: "scroll_depth",
      triggerValue: userBehavior.scrollDepth,
      actionType: "highlight_cta",
      actionContent: "primary_cta",
      priority: "medium",
      message: "Ready to take the next step?",
    });
  }

  return { rules };
}
