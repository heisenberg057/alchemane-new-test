"use client";

import { use } from "react";
import PageEditor from "@/components/admin/PageEditor";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <PageEditor pageId={resolvedParams.id} />;
}
