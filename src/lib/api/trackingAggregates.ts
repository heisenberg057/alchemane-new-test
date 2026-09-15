import type { Where } from "payload";
import { getPayloadSingleton } from "@/lib/api/getPayload";

type AdClickDoc = {
  id: string | number;
  campaignName?: string | null;
  adSetName?: string | null;
  adName?: string | null;
  converted?: boolean | null;
  createdAt?: string;
};

function keyTriplet(c: AdClickDoc | any): string {
  return [
    c.campaignName ?? "",
    c.adSetName ?? "",
    c.adName ?? "",
    c.campaignSource ?? "",
  ].join("\u0001");
}

const LEAD_VALUE = 5000; // Default lead value for revenue estimation

export async function aggregateAdPerformance(options: {
  startDate?: string | null;
  endDate?: string | null;
  campaignName?: string | null;
}): Promise<
  {
    campaignName: string | null;
    adSetName: string | null;
    adName: string | null;
    campaignSource: string | null;
    clicks: number;
    conversions: number;
    conversionRate: string;
    revenue: number;
  }[]
> {
  const payload = await getPayloadSingleton();
  const and: Where[] = [];
  if (options.startDate && options.endDate) {
    and.push({ createdAt: { greater_than_equal: options.startDate } });
    and.push({ createdAt: { less_than_equal: options.endDate } });
  }
  if (options.campaignName) {
    and.push({ campaignName: { equals: options.campaignName } });
  }

  const where: Where =
    and.length > 0 ? ({ and } as Where) : ({} as Where);

  const res = await payload.find({
    collection: "ad-clicks",
    where,
    limit: 10000,
    depth: 0,
    overrideAccess: true,
  });

  const docs = res.docs as any[];
  const groups = new Map<
    string,
    { clicks: number; conversions: number; sample: any }
  >();

  for (const d of docs) {
    const k = keyTriplet(d);
    const g = groups.get(k);
    const conv = Boolean(d.converted);
    if (g) {
      g.clicks += 1;
      if (conv) g.conversions += 1;
    } else {
      groups.set(k, {
        clicks: 1,
        conversions: conv ? 1 : 0,
        sample: d,
      });
    }
  }

  return Array.from(groups.values()).map(({ clicks, conversions, sample }) => {
    const rate =
      clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : "0";
    return {
      campaignName: sample.campaignName ?? null,
      adSetName: sample.adSetName ?? null,
      adName: sample.adName ?? null,
      campaignSource: sample.campaignSource ?? null,
      clicks,
      conversions,
      conversionRate: `${rate}%`,
      revenue: conversions * LEAD_VALUE,
    };
  });
}

export async function aggregateCampaignList(): Promise<
  {
    name: string;
    clicks: number;
    conversions: number;
    conversionRate: string;
    firstClick: string | null;
    lastClick: string | null;
  }[]
> {
  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "ad-clicks",
    where: {},
    limit: 20_000,
    depth: 0,
    overrideAccess: true,
  });

  const byCampaign = new Map<
    string,
    {
      clicks: number;
      conversions: number;
      first: string | null;
      last: string | null;
    }
  >();

  for (const raw of res.docs as AdClickDoc[]) {
    const name = raw.campaignName;
    if (!name) continue;
    const cur = byCampaign.get(name) ?? {
      clicks: 0,
      conversions: 0,
      first: null as string | null,
      last: null as string | null,
    };
    cur.clicks += 1;
    if (raw.converted) cur.conversions += 1;
    const t = raw.createdAt;
    if (t) {
      if (!cur.first || t < cur.first) cur.first = t;
      if (!cur.last || t > cur.last) cur.last = t;
    }
    byCampaign.set(name, cur);
  }

  return Array.from(byCampaign.entries()).map(([name, v]) => {
    const rate =
      v.clicks > 0 ? ((v.conversions / v.clicks) * 100).toFixed(2) : "0";
    return {
      name,
      clicks: v.clicks,
      conversions: v.conversions,
      conversionRate: `${rate}%`,
      firstClick: v.first,
      lastClick: v.last,
    };
  });
}

export async function getAdClickById(
  id: string
): Promise<Record<string, unknown> | null> {
  const payload = await getPayloadSingleton();
  try {
    const doc = await payload.findByID({
      collection: "ad-clicks",
      id,
      depth: 1,
      overrideAccess: true,
    });
    return doc as Record<string, unknown> | null;
  } catch {
    return null;
  }
}
