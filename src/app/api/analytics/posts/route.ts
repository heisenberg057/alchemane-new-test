import type { Where } from "payload";
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const payload = await getPayloadSingleton();
  const and: Where[] = [{ pageUrl: { contains: "/blog" } }];
  if (startDate && endDate) {
    and.push({ createdAt: { greater_than_equal: startDate } });
    and.push({ createdAt: { less_than_equal: endDate } });
  }

  const res = await payload.find({
    collection: "analytics",
    where: { and } as Where,
    limit: 50_000,
    depth: 0,
    overrideAccess: true,
  });

  const byPath: Record<string, number> = {};
  for (const row of res.docs) {
    const p = (row as { pageUrl?: string }).pageUrl || "";
    if (!p) continue;
    byPath[p] = (byPath[p] ?? 0) + 1;
  }

  const posts = Object.entries(byPath)
    .map(([path, views]) => {
      const slug = path.split("/").filter(Boolean).pop() || path;
      return {
        path,
        slug,
        views,
        title: slug,
      };
    })
    .sort((a, b) => b.views - a.views);

  return NextResponse.json(jsonSuccess({ posts }));
}

export const GET = withErrorHandling(handleGET);
