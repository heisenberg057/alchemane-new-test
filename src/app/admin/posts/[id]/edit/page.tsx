"use client";

import PostEditor from "@/components/admin/PostEditor";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string; // Route param is always a numeric Payload post ID
  
  return <PostEditor postId={id} />;
}
