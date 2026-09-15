import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const days = Math.min(Number(url.searchParams.get("days")) || 30, 366);

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);
  const since = dateFrom.toISOString();
  const dateWhere = { createdAt: { greater_than_equal: since } };

  const payload = await getPayloadSingleton();

  const [
    abandonmentRes,
    recoveryRes,
    exitIntentRes,
    conversionRes,
    calcTotal,
    calcConverted,
    triggersRes,
    hotLeadsAgg,
  ] = await Promise.all([
    // 1. Total Abandonments
    payload.find({
      collection: "form-abandonments",
      where: dateWhere as never,
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    // 2. Recovered Abandonments
    payload.find({
      collection: "form-abandonments",
      where: {
        and: [
          dateWhere as never,
          { recoveryEmailSent: { equals: true } },
        ],
      },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    // 3. Exit Intent Performance
    payload.find({
      collection: "exit-intents",
      where: dateWhere as never,
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    // 4. Conversion Events (Form Views/Submits)
    payload.find({
      collection: "conversion-events",
      where: dateWhere as never,
      limit: 2000,
      depth: 0,
      overrideAccess: true,
    }),
    // 5. Calculators
    payload.find({
      collection: "calculators",
      where: dateWhere as never,
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "calculators",
      where: {
        and: [
          dateWhere as never,
          { leadCaptured: { equals: true } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    }),
    // 6. Behavioral Triggers
    payload.find({
      collection: "behavioral-triggers",
      where: dateWhere as never,
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    // 7. Hot Leads Count
    payload.find({
      collection: "lead-scores",
      where: { category: { equals: "hot" } },
      limit: 1,
      overrideAccess: true,
    }),
  ]);

  // Aggregate Abandonment Points
  const abandonmentPointsMap = new Map<string, number>();
  abandonmentRes.docs.forEach((doc: any) => {
    const step = doc.currentStep || '1';
    let type = doc.formType || 'General Inquiry';
    if (type === 'contact') type = 'Contact Form';
    if (type === 'consultation') type = 'Consultation Form';
    if (type === 'homepage_contact') type = 'Homepage Contact Form';
    if (type === 'calculator') type = 'Cost Calculator';
    
    const key = `Step ${step} (${type})`;
    abandonmentPointsMap.set(key, (abandonmentPointsMap.get(key) || 0) + 1);
  });
  const abandonmentPoints = Array.from(abandonmentPointsMap.entries())
    .map(([key, count]) => ({ label: key, _count: count }))
    .sort((a, b) => b._count - a._count)
    .slice(0, 5);

  // Aggregate Exit Intent by Popup Type
  const exitByPopupMap = new Map<string, number>();
  let exitConverted = 0;
  exitIntentRes.docs.forEach((doc: any) => {
    exitByPopupMap.set(doc.popupType, (exitByPopupMap.get(doc.popupType) || 0) + 1);
    if (doc.action === 'submit' || doc.action === 'click' || doc.emailCaptured) {
      exitConverted++;
    }
  });
  const exitByPopup = Array.from(exitByPopupMap.entries()).map(([type, count]) => ({
    popupType: type,
    _count: count
  }));

  // Aggregate Triggers Performance
  const triggersMap = new Map<string, { total: number; converted: number; actionType: string }>();
  triggersRes.docs.forEach((doc: any) => {
    const key = doc.triggerType;
    const cur = triggersMap.get(key) || { total: 0, converted: 0, actionType: doc.actionType };
    cur.total++;
    if (doc.converted) cur.converted++;
    triggersMap.set(key, cur);
  });
  const triggers = Array.from(triggersMap.entries()).map(([type, val]) => ({
    triggerType: type,
    actionType: val.actionType,
    conversionRate: val.total > 0 ? Math.round((val.converted / val.total) * 100) : 0
  }));

  // Extraction for conversion summary
  const formViewed = conversionRes.docs.filter((d: any) => d.eventName === 'form_view' || d.type === 'view').length;
  const formSubmitted = conversionRes.docs.filter((d: any) => d.eventName === 'form_submit' || d.type === 'submit').length;

  const totalCalculations = calcTotal.totalDocs;
  const convertedCalculations = calcConverted.totalDocs;
  const calcConversionRate =
    totalCalculations > 0
      ? parseFloat(((convertedCalculations / totalCalculations) * 100).toFixed(1))
      : 0;

  const recoveredTotal = recoveryRes.docs.filter((d: any) => d.recovered).length;
  const emailsSentTotal = recoveryRes.totalDocs;

  return NextResponse.json(
    jsonSuccess(
      {
        period: `Last ${days} days`,
        abandonment: {
          total: abandonmentRes.totalDocs,
          withEmail: abandonmentRes.docs.filter((d: any) => d.email).length,
          recovered: recoveredTotal,
          emailsSent: emailsSentTotal,
          recoveryRate: emailsSentTotal > 0 ? Math.round((recoveredTotal / emailsSentTotal) * 100) : 0,
          abandonmentPoints,
        },
        exitIntent: {
          total: exitIntentRes.totalDocs,
          emailsCaptured: exitIntentRes.docs.filter((d: any) => d.emailCaptured).length,
          converted: exitConverted,
          conversionRate: exitIntentRes.totalDocs > 0 ? Math.round((exitConverted / exitIntentRes.totalDocs) * 100) : 0,
          byPopupType: exitByPopup,
        },
        conversion: {
          totalEvents: conversionRes.totalDocs,
          conversionRate: formViewed > 0 ? Math.round((formSubmitted / formViewed) * 100) : 0,
          formSubmitted,
          formViewed,
        },
        calculator: {
          total: totalCalculations,
          converted: convertedCalculations,
          conversionRate: calcConversionRate,
        },
        triggers,
        triggersTotal: triggersRes.totalDocs,
        hotLeads: hotLeadsAgg.totalDocs,
      },
      "Dashboard stats retrieved"
    )
  );
}

export const GET = withErrorHandling(handleGET);
