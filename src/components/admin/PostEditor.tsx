"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreatePost, useUpdatePost, usePost } from "@/lib/hooks/usePosts";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
  Share2,
  Code2,
  BarChart3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { POST_CATEGORY_OPTIONS } from "@/config/postCategoryOptions";
import { mediaService } from "@/lib/api/media.service";
import { postsService } from "@/lib/api/posts.service";
import { VisualEditor } from "./editor/VisualEditor";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { blocksToPlainText } from "@/lib/utils/blocksToPlainText";
import { normalizeBlocks } from "@/lib/utils/normalizeBlocks";
import { AiGenerateButton } from "@/components/admin/AiGenerateButton";

// ─── Schema ────────────────────────────────────────────────────────────────────
const postSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  content: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featuredImage: z.string().optional(),
  // Basic SEO
  metaTitle: z.string().max(60, "Meta title should be under 60 chars").optional(),
  metaDescription: z.string().max(160, "Meta description should be under 160 chars").optional(),
  metaKeywords: z.string().optional(),
  canonicalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  // Open Graph / Social
  ogImageUrl: z.string().optional(),
  twitterTitle: z.string().max(70, "Twitter title should be under 70 chars").optional(),
  twitterDescription: z.string().max(200, "Twitter description should be under 200 chars").optional(),
  // Schema / Structured Data
  schemaType: z.string().optional(),
  customSchema: z.string().optional(),
  // SEO Analysis
  focusKeyword: z.string().optional(),
  // Taxonomy
  category: z.string().optional(),
  tags: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostEditorProps {
  postId?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isOgUploading, setIsOgUploading] = useState(false);
  const [featuredImageId, setFeaturedImageId] = useState<number | string | null>(null);
  const [ogImageId, setOgImageId] = useState<number | string | null>(null);
  const [isVisualEditorOpen, setIsVisualEditorOpen] = useState(false);
  // "idle" | "saving" | "saved" | "error"
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  // True when blocks have changed since the last successful save
  const [isDirty, setIsDirty] = useState(false);
  // Tracks the last successfully-autosaved serialisation to avoid duplicate writes
  const lastSavedRef = useRef<string>("");
  // Guard: prevents overlapping autosave requests
  const isSavingRef = useRef(false);
  // localStorage key for recovery backup (keyed by post id, or "new" for create mode)
  const lsKey = postId ? `vb_recovery_${postId}` : null;

  // Collapsible section state
  const [openSections, setOpenSections] = useState({
    basicSeo: true,
    social: false,
    schema: false,
    analysis: false,
  });

  const { blocks, setBlocks } = useEditorStore();

  const { data: postData, isLoading: isLoadingPost } = usePost(postId || "");
  const post = postData;
  // blocksData is already a string — use it directly as the dep so the effect
  // fires whenever the actual content changes, not a JSON.stringify-wrapped copy.
  const blocksDataString = (post as Record<string, unknown> | undefined)?.blocksData as string | undefined;
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  // Read-only metrics from server
  const [metrics, setMetrics] = useState<{ readingTime?: number; wordCount?: number; seoScore?: number; seoFeedback?: string; aiScore?: number } | null>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "DRAFT",
      featuredImage: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      canonicalUrl: "",
      ogImageUrl: "",
      twitterTitle: "",
      twitterDescription: "",
      schemaType: "BlogPosting",
      customSchema: "",
      focusKeyword: "",
      category: "__none__",
      tags: "",
    },
  });

  const watchedTitle = form.watch("title");
  // AI prompt content comes only from the canonical blocksData blocks — never from content
  const contentForAi = useMemo(() => {
    return blocksToPlainText(blocks);
  }, [blocks]);

  // Populate form fields when post loads (runs on every post object change / refetch).
  // Does NOT touch blocks — blocks are owned exclusively by the effect below.
  useEffect(() => {
    if (!post) return;
    {
      const p = post as Record<string, unknown>;
      const statusRaw = String(p.status ?? p._status ?? "DRAFT").toUpperCase();
      const status: "DRAFT" | "PUBLISHED" = statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

      form.reset({
        title: String(p.title ?? ""),
        slug: String(p.slug ?? ""),
        status,
        featuredImage: typeof p.featuredImage === "string" ? p.featuredImage : undefined,
        // Basic SEO
        metaTitle: String(p.metaTitle ?? ""),
        metaDescription: String(p.metaDescription ?? ""),
        metaKeywords: String(p.metaKeywords ?? ""),
        canonicalUrl: String(p.canonicalUrl ?? ""),
        // Social
        ogImageUrl: String(p.ogImageUrl ?? ""),
        twitterTitle: String(p.twitterTitle ?? ""),
        twitterDescription: String(p.twitterDescription ?? ""),
        // Schema
        schemaType: String(p.schemaType ?? "BlogPosting"),
        customSchema:
          p.customSchema != null
            ? typeof p.customSchema === "string"
              ? p.customSchema
              : JSON.stringify(p.customSchema, null, 2)
            : "",
        // SEO Analysis
        focusKeyword: String(p.focusKeyword ?? ""),
        // Taxonomy
        category: typeof p.category === "string" && p.category ? p.category : "__none__",
        tags: Array.isArray(p.tags)
          ? (p.tags as { name?: string }[]).map((t) => t.name).filter(Boolean).join(", ")
          : "",
      });

      setFeaturedImageId((p.heroImageId as number | string | undefined) ?? null);
      setOgImageId((p.ogImageId as number | string | undefined) ?? null);

      // Read-only metrics
      setMetrics({
        readingTime: p.readingTime as number | undefined,
        wordCount: p.wordCount as number | undefined,
        seoScore: p.seoScore as number | undefined,
        seoFeedback: p.seoFeedback as string | undefined,
        aiScore: p.aiOptimizationScore as number | undefined,
      });

    }
  // form is intentionally excluded: it is stable (useForm returns stable ref).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  // Stable numeric post id (null when creating a new post)
  const postNumericId = post ? Number((post as Record<string, unknown>).id) : null;

  // ── Shared helper: insert a default starter block ─────────────────────────────
  const applyDefaultBlock = useCallback(() => {
    useEditorStore.getState().setBlocks([{
      id: uuidv4(),
      type: 'text',
      props: { text: 'Start writing here...', fontSize: '16px', color: '#333333' },
    }]);
  }, []);

  // ── Create-mode reset ─────────────────────────────────────────────────────────
  // Fires whenever postId becomes falsy (navigating to /admin/posts/new from any
  // previous page, including another edit route). Fully clears all editor state so
  // stale blocks from a previous post can never bleed in.
  useEffect(() => {
    if (postId) return; // edit mode — blocks-init effect below owns this path
    useEditorStore.getState().resetEditor();
    setSaveStatus('idle');
    setIsDirty(false);
    lastSavedRef.current = '';
    // Defer by one frame so Zustand's reset has flushed before we write the default block
    requestAnimationFrame(() => {
      applyDefaultBlock();
    });
  // applyDefaultBlock is stable (useCallback []); postId is the only real dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // ── Visual Builder block initialisation ──────────────────────────────────────
  // Deps: [post?.id, blocksDataString]
  //   - post?.id         : fires when a different post is loaded
  //   - blocksDataString : fires when the same post's blocks change after save/refetch
  //
  // Only runs once post.id is defined (fetch complete). Does nothing while loading.
  useEffect(() => {
    const p = post as Record<string, unknown> | undefined;
    console.log('[PostEditor] blocks effect', { id: p?.id, hasBlocksData: !!p?.blocksData, blocksDataType: typeof p?.blocksData });

    // Guard: do not run until a real post is loaded.
    if (!p?.id) return;

    const rawBlocks = p.blocksData;

    if (!rawBlocks) {
      console.log('[PostEditor] Post has no blocksData → inserting default block');
      applyDefaultBlock();
      return;
    }

    // Step 1: parse (blocksData is always a string from the service layer)
    let parsed: unknown;
    try {
      parsed = typeof rawBlocks === 'string' ? JSON.parse(rawBlocks) : rawBlocks;
    } catch (e) {
      console.error('[PostEditor] blocksData JSON.parse failed', e);
      useEditorStore.getState().setBlocks([]);
      return;
    }

    // Step 2: unwrap double-stringified values (defensive)
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        console.error('[PostEditor] blocksData double-parse failed', e);
        useEditorStore.getState().setBlocks([]);
        return;
      }
    }

    // Step 3: extract blocks from all known shapes
    let blockList: unknown[];
    if (Array.isArray(parsed)) {
      blockList = parsed; // legacy bare-array format
    } else if (
      parsed !== null &&
      typeof parsed === 'object' &&
      Array.isArray((parsed as Record<string, unknown>).blocks)
    ) {
      blockList = (parsed as Record<string, unknown>).blocks as unknown[]; // canonical { version, blocks[] }
    } else {
      console.warn('[PostEditor] blocksData has unknown shape — inserting default block', parsed);
      applyDefaultBlock();
      return;
    }

    if (blockList.length > 0) {
      const normalised = normalizeBlocks(blockList);
      console.log(`[PostEditor] Loaded ${normalised.length} block(s) for post id=${p.id}`);

      // ── localStorage recovery check ────────────────────────────────────────
      // If there is a newer local backup, offer to restore it.
      const lsKeyLocal = `vb_recovery_${p.id}`;
      try {
        const stored = localStorage.getItem(lsKeyLocal);
        if (stored) {
          const backup = JSON.parse(stored) as { ts: number; blocks: unknown[] };
          if (
            backup &&
            typeof backup.ts === 'number' &&
            Array.isArray(backup.blocks) &&
            backup.blocks.length > 0 &&
            backup.ts > Date.now() - 24 * 60 * 60 * 1000 // only within last 24h
          ) {
            const serverSerial = JSON.stringify(normalised);
            const backupSerial = JSON.stringify(normalizeBlocks(backup.blocks));
            if (backupSerial !== serverSerial) {
              const relMin = Math.round((Date.now() - backup.ts) / 60000);
              const restore = window.confirm(
                `A local backup from ${relMin} min ago was found with ${backup.blocks.length} block(s).\n\nRestore from local backup? (Cancel to use the server version.)`
              );
              if (restore) {
                useEditorStore.getState().setBlocks(normalizeBlocks(backup.blocks));
                return;
              }
            }
          }
        }
      } catch {
        // localStorage read/parse failure — ignore silently
      }

      useEditorStore.getState().setBlocks(normalised);
    } else {
      console.log('[PostEditor] blocksData has 0 blocks → inserting default block');
      applyDefaultBlock();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id, blocksDataString]);

  // ── Dirty detection ──────────────────────────────────────────────────────────
  // Compares current blocks to the last saved snapshot. Runs on every blocks change.
  useEffect(() => {
    if (!Array.isArray(blocks)) return;
    const current = JSON.stringify(blocks);
    setIsDirty(current !== lastSavedRef.current);
  }, [blocks]);

  // ── Before-unload warning ─────────────────────────────────────────────────────
  // Warns the user if they try to close/refresh the tab with unsaved changes.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes in the Visual Builder.";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // ── Browser title dirty indicator ─────────────────────────────────────────
  useEffect(() => {
    const base = postId ? "Edit Post" : "New Post";
    document.title = isDirty ? `* ${base} — AHL Admin` : `${base} — AHL Admin`;
    return () => { document.title = "AHL Admin"; };
  }, [isDirty, postId]);

  // ── localStorage recovery backup ──────────────────────────────────────────
  // Saves blocks to localStorage every ~5s when dirty, keyed by post id.
  useEffect(() => {
    if (!lsKey) return; // only for existing posts (not create mode)
    if (!isDirty) return;
    if (!Array.isArray(blocks) || blocks.length === 0) return;

    const t = setTimeout(() => {
      try {
        localStorage.setItem(lsKey, JSON.stringify({ ts: Date.now(), blocks }));
      } catch {
        // Quota exceeded or private mode — ignore
      }
    }, 5000);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, isDirty, lsKey]);

  // ── Autosave ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Only autosave when editing an existing post
    if (!postNumericId) return;
    // Skip while post data is still loading — avoid overwriting with the initial empty state
    if (isLoadingPost) return;

    const timeout = setTimeout(async () => {
      if (!Array.isArray(blocks) || blocks.length === 0) return;

      // Race-condition guard: skip if a request is already in-flight
      if (isSavingRef.current) {
        console.log('[PostEditor] Autosave skipped — previous save still in-flight');
        return;
      }

      // Sanitize via normalizeBlocks
      const safeBlocks = normalizeBlocks(blocks);

      if (safeBlocks.length === 0) {
        console.warn('[PostEditor] Autosave skipped — no valid blocks after sanitization');
        return;
      }

      // Skip duplicate saves
      const serialised = JSON.stringify(safeBlocks);
      if (serialised === lastSavedRef.current) return;

      const payload = JSON.stringify({ version: 1, blocks: safeBlocks });
      console.log('[PostEditor] Autosaving blocks:', safeBlocks.length);
      isSavingRef.current = true;
      setSaveStatus('saving');

      try {
        const result = await postsService.autosaveBlocks(postNumericId, payload);
        isSavingRef.current = false;
        if (result.success) {
          lastSavedRef.current = serialised;
          setSaveStatus('saved');
          setIsDirty(false);
          // Clear localStorage backup after successful server save
          if (lsKey) {
            try { localStorage.removeItem(lsKey); } catch { /* ignore */ }
          }
          // Reset to idle after 3s so the indicator fades out
          setTimeout(() => setSaveStatus((s) => s === 'saved' ? 'idle' : s), 3000);
        } else {
          console.error('[PostEditor] Autosave returned failure:', result);
          setSaveStatus('error');
        }
      } catch (e) {
        isSavingRef.current = false;
        console.error('[PostEditor] Autosave error:', e);
        setSaveStatus('error');
        // Retry once after 5s on network/server error
        setTimeout(async () => {
          if (isSavingRef.current) return; // another save started in the interim
          isSavingRef.current = true;
          try {
            const retry = await postsService.autosaveBlocks(postNumericId, payload);
            isSavingRef.current = false;
            if (retry.success) {
              lastSavedRef.current = serialised;
              setSaveStatus('saved');
              setIsDirty(false);
              if (lsKey) {
                try { localStorage.removeItem(lsKey); } catch { /* ignore */ }
              }
              setTimeout(() => setSaveStatus((s) => s === 'saved' ? 'idle' : s), 3000);
            }
          } catch {
            isSavingRef.current = false;
            // Retry also failed — leave status as "error" for user awareness
          }
        }, 5000);
      }
    }, 2500);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, postNumericId]);

  // Auto-generate slug from title (new posts only)
  const title = form.watch("title");
  useEffect(() => {
    if (!postId && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug);
    }
  }, [title, postId, form]);

  // Auto-populate metaTitle from title if empty
  const watchTitle = form.watch("title");
  const watchMetaTitle = form.watch("metaTitle");
  useEffect(() => {
    if (watchTitle && !watchMetaTitle) {
      form.setValue("metaTitle", watchTitle.slice(0, 60));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchTitle]);

  const onSubmit = async (values: PostFormValues) => {
    try {
      const payloadStatus = values.status === "PUBLISHED" ? "published" : "draft";
      const latestBlocks = useEditorStore.getState().blocks;
      let blocksJson: string | null = null;
      if (latestBlocks.length > 0) {
        try {
          const safeBlocks = normalizeBlocks(latestBlocks);
          if (safeBlocks.length !== latestBlocks.length) {
            console.warn('[PostEditor] Dropped', latestBlocks.length - safeBlocks.length, 'malformed blocks on save');
          }
          const candidate = JSON.stringify({ version: 1, source: "editor", blocks: safeBlocks });
          // Round-trip parse to verify it is valid JSON before storing
          JSON.parse(candidate);
          blocksJson = candidate;
        } catch (e) {
          console.error("[PostEditor] blocksData serialisation failed — blocks will not be saved", e);
          toast({ title: "Warning", description: "Visual Builder content could not be serialised and was not saved.", variant: "destructive" });
        }
      }

      // Resolve tag names → existing or newly-created tag IDs
      const tagNames = values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      const { ids: resolvedTagIds, failedNames } = await postsService.resolveTagIds(tagNames);
      if (failedNames.length > 0) {
        toast({
          title: "Some tags could not be saved",
          description: `These tags were skipped: ${failedNames.join(", ")}`,
          variant: "destructive",
        });
      }

      const payload = {
        title: values.title,
        slug: values.slug,
        // content is not the blog body field — do not write block JSON into it
        _status: payloadStatus,
        category: values.category && values.category !== "__none__" ? values.category : null,
        heroImage:
          typeof featuredImageId === "string" && /^\d+$/.test(featuredImageId)
            ? Number(featuredImageId)
            : featuredImageId ?? null,
        blocksData: blocksJson,
        tags: resolvedTagIds,
        canonicalUrl: values.canonicalUrl || null,
        // Nested Payload groups
        // meta.title has minLength:40, maxLength:60 in the Payload schema.
        // Send null rather than an out-of-range value so Payload never rejects the save.
        meta: {
          title: values.metaTitle && values.metaTitle.length >= 40 && values.metaTitle.length <= 60
            ? values.metaTitle
            : null,
          description: values.metaDescription && values.metaDescription.length >= 140 && values.metaDescription.length <= 160
            ? values.metaDescription
            : null,
          keywords: values.metaKeywords || null,
          image:
            typeof ogImageId === "string" && /^\d+$/.test(ogImageId)
              ? Number(ogImageId)
              : ogImageId ?? null,
          twitterTitle: values.twitterTitle || null,
          twitterDescription: values.twitterDescription || null,
        },
        structuredData: {
          schemaType: values.schemaType || "BlogPosting",
          customSchema: values.customSchema
            ? (() => { try { return JSON.parse(values.customSchema); } catch { return values.customSchema; } })()
            : null,
        },
        seoAnalysis: {
          focusKeyword: values.focusKeyword || null,
        },
      };

      if (postId) {
        const numericId = Number((post as { id?: unknown })?.id ?? postId);
        const updateRes = await updateMutation.mutateAsync({ id: numericId, data: payload });
        if (!updateRes?.success) {
          throw new Error(updateRes?.message || "Failed to update post");
        }
        // Refresh metrics from server response
        const updatedDoc = (updateRes.data as any)?.doc ?? updateRes.data;
        if (updatedDoc) {
          setMetrics({
            readingTime: updatedDoc.metrics?.readingTime,
            wordCount: updatedDoc.metrics?.wordCount,
            seoScore: updatedDoc.seoAnalysis?.seoScore,
            seoFeedback: updatedDoc.seoAnalysis?.seoFeedback,
            aiScore: updatedDoc.aiOptimization?.score,
          });
        }
        // Clear localStorage recovery backup after successful manual save
        if (lsKey) {
          try { localStorage.removeItem(lsKey); } catch { /* ignore */ }
        }
        toast({
          title: values.status === "PUBLISHED" ? "Post published" : "Draft saved",
          description: values.status === "PUBLISHED"
            ? "Your post is now live."
            : "Changes saved. Set status to Published when ready.",
        });
      } else {
        const createRes = await createMutation.mutateAsync(payload);
        if (!createRes?.success) {
          throw new Error(createRes?.message || "Failed to create post");
        }
        const newId = (createRes.data as any)?.doc?.id ?? (createRes.data as any)?.id;
        toast({ title: "Post created", description: "You can continue editing below." });
        if (newId) {
          router.push(`/admin/posts/${newId}/edit`);
        } else {
          router.push("/admin/posts");
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save post";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "featured" | "og"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "featured") setIsUploading(true);
    else setIsOgUploading(true);

    try {
      const defaultAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const altText =
        window.prompt(
          "Enter alt text for this image (for SEO and accessibility):",
          defaultAlt
        ) ?? defaultAlt;
      const res = await mediaService.uploadFile(file, altText);
      if (res.success) {
        const rawImageId = res.data?.media?.[0]?.id;
        const imageId =
          typeof rawImageId === "number" || typeof rawImageId === "string" ? rawImageId : null;
        const imageUrl = res.data?.media?.[0]?.url || res.data?.url;
        if (!imageId || !imageUrl || typeof imageUrl !== "string") {
          toast({ title: "Upload failed", description: "Upload response is incomplete.", variant: "destructive" });
          return;
        }
        if (type === "featured") {
          setFeaturedImageId(imageId);
          form.setValue("featuredImage", imageUrl);
        } else {
          setOgImageId(imageId);
          form.setValue("ogImageUrl", imageUrl);
        }
        toast({ title: "Image uploaded" });
      } else {
        toast({ title: "Upload failed", description: res.message || "Image upload did not complete.", variant: "destructive" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected upload error";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      if (type === "featured") setIsUploading(false);
      else setIsOgUploading(false);
    }
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const seoScore = metrics?.seoScore;
  const seoScoreColor =
    seoScore == null ? "bg-muted text-muted-foreground"
    : seoScore >= 70 ? "bg-green-100 text-green-700"
    : seoScore >= 40 ? "bg-yellow-100 text-yellow-700"
    : "bg-red-100 text-red-700";

  if (postId && isLoadingPost) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-muted rounded" />
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-muted rounded" />
            <div className="h-9 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border p-6 space-y-4">
              <div className="h-5 w-24 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded" />
              <div className="h-5 w-20 bg-muted rounded" />
              {/* Visual builder area skeleton */}
              <div className="h-44 w-full bg-muted rounded-lg flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Loading Visual Builder…</span>
              </div>
            </div>
          </div>
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6 space-y-3">
              <div className="h-5 w-24 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded" />
            </div>
            <div className="rounded-lg border p-6 space-y-3">
              <div className="h-5 w-28 bg-muted rounded" />
              <div className="h-32 w-full bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PageHeader
          title={postId ? "Edit Post" : "Create New Post"}
          actions={
            <div className="flex gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  if (isDirty && !window.confirm("You have unsaved changes. Leave anyway?")) return;
                  router.push("/admin/posts");
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
              </Button>
              {postId && (post as any)?.slug && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const slug = (post as any).slug;
                    const isDraft = form.getValues("status") !== "PUBLISHED";
                    const url = `/blog/${slug}${isDraft ? "?draft=1" : ""}`;
                    window.open(url, "_blank");
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> Preview
                </Button>
              )}
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.watch("status") === "PUBLISHED" ? "Publish" : "Save Draft"}
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title, Slug, Content */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter post title" className="text-lg font-medium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="post-url-slug" {...field} />
                      </FormControl>
                      <FormDescription>The URL-friendly version of the name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field: _field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        <span>Content</span>
                        <span className="flex items-center gap-2">
                          {saveStatus === 'saving' ? (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Loader2 className="h-2.5 w-2.5 animate-spin" /> Saving…
                            </span>
                          ) : saveStatus === 'error' ? (
                            <span className="text-[10px] text-destructive font-medium">Save failed — retrying</span>
                          ) : isDirty ? (
                            <span className="text-[10px] text-amber-600 font-medium">Unsaved changes</span>
                          ) : saveStatus === 'saved' ? (
                            <span className="text-[10px] text-green-600 font-medium">Saved ✓</span>
                          ) : null}
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            Visual Builder Enabled
                          </span>
                        </span>
                      </FormLabel>
                      <FormControl>
                        {isVisualEditorOpen ? (
                          <div className="fixed inset-0 z-[100] bg-[#131415] w-screen h-screen">
                            <VisualEditor onClose={() => setIsVisualEditorOpen(false)} />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/50 gap-4 transition-colors hover:border-primary/50">
                            <div className="text-muted-foreground text-center">
                              <p className="font-semibold text-lg text-foreground mb-1">
                                Design your post visually
                              </p>
                              <p className="text-sm">
                                Use our drag-and-drop builder to create powerful, stunning layouts.
                              </p>
                              {blocks.length > 0 && (
                                <p className="text-xs text-primary mt-2 font-medium">
                                  {blocks.length} block{blocks.length !== 1 ? "s" : ""} in editor
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              size="lg"
                              className="bg-[#26292c] hover:bg-[#131415] text-white mt-2"
                              onClick={() => setIsVisualEditorOpen(true)}
                            >
                              Launch Visual Builder
                            </Button>
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* ── SEO Settings Card ── */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  SEO &amp; Schema Settings
                  {seoScore != null && (
                    <Badge className={`ml-auto text-xs font-semibold ${seoScoreColor}`}>
                      SEO Score: {seoScore}/100
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">

                {/* ── 1. Basic SEO ── */}
                <Collapsible open={openSections.basicSeo} onOpenChange={() => toggleSection("basicSeo")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-0 font-semibold text-sm hover:bg-transparent">
                      <span className="flex items-center gap-2"><Search className="h-3.5 w-3.5" /> Basic SEO</span>
                      {openSections.basicSeo ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-2 pb-4">
                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex w-full items-center justify-between gap-2">
                            <FormLabel className="!mt-0">Meta Title</FormLabel>
                            <AiGenerateButton
                              type="title"
                              postId={postId}
                              title={watchedTitle}
                              content={contentForAi}
                              onAccept={(val) => form.setValue("metaTitle", val)}
                            />
                          </div>
                          <FormControl>
                            <Input placeholder="SEO Title (50–60 chars)" {...field} />
                          </FormControl>
                          <div className={`text-xs text-right ${(field.value?.length || 0) > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                            {field.value?.length || 0}/60
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex w-full items-center justify-between gap-2">
                            <FormLabel className="!mt-0">Meta Description</FormLabel>
                            <AiGenerateButton
                              type="description"
                              postId={postId}
                              title={watchedTitle}
                              content={contentForAi}
                              onAccept={(val) => form.setValue("metaDescription", val)}
                            />
                          </div>
                          <FormControl>
                            <Textarea placeholder="Brief description for search engines (150–160 chars)" className="h-20 resize-none" {...field} />
                          </FormControl>
                          <div className={`text-xs text-right ${(field.value?.length || 0) > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                            {field.value?.length || 0}/160
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Keywords</FormLabel>
                          <FormControl>
                            <Input placeholder="hair transplant, hair loss, hair system" {...field} />
                          </FormControl>
                          <FormDescription>Comma-separated keywords for this page.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="canonicalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Canonical URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://americanhairline.com/blog/post-slug" {...field} />
                          </FormControl>
                          <FormDescription>Leave blank to use the default post URL.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="focusKeyword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Focus Keyword</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. hair transplant cost" {...field} />
                          </FormControl>
                          <FormDescription>Primary keyword to optimise this post around.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* ── 2. Open Graph / Social ── */}
                <Collapsible open={openSections.social} onOpenChange={() => toggleSection("social")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-0 font-semibold text-sm hover:bg-transparent">
                      <span className="flex items-center gap-2"><Share2 className="h-3.5 w-3.5" /> Open Graph / Social</span>
                      {openSections.social ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-2 pb-4">
                    {/* OG Image */}
                    <FormField
                      control={form.control}
                      name="ogImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Open Graph Image (1200×630 recommended)</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              {field.value ? (
                                <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-md border">
                                  <Image src={field.value} alt="OG Image" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute right-2 top-2"
                                    onClick={() => {
                                      field.onChange("");
                                      setOgImageId(null);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex aspect-[1200/630] w-full flex-col items-center justify-center rounded-md border border-dashed bg-muted/20">
                                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-1" />
                                  <p className="text-xs text-muted-foreground">No OG image</p>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="og-image-upload"
                                onChange={(e) => handleImageUpload(e, "og")}
                                disabled={isOgUploading}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full"
                                disabled={isOgUploading}
                                onClick={() => document.getElementById("og-image-upload")?.click()}
                              >
                                {isOgUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload OG Image"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>Falls back to Featured Image if not set.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitterTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter / X Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Twitter card title (leave blank to use Meta Title)" {...field} />
                          </FormControl>
                          <div className="text-xs text-right text-muted-foreground">
                            {field.value?.length || 0}/70
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitterDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter / X Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Twitter card description (leave blank to use Meta Description)" className="h-16 resize-none" {...field} />
                          </FormControl>
                          <div className="text-xs text-right text-muted-foreground">
                            {field.value?.length || 0}/200
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* ── 3. Schema / JSON-LD ── */}
                <Collapsible open={openSections.schema} onOpenChange={() => toggleSection("schema")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-0 font-semibold text-sm hover:bg-transparent">
                      <span className="flex items-center gap-2"><Code2 className="h-3.5 w-3.5" /> Schema / JSON-LD</span>
                      {openSections.schema ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-2 pb-4">
                    <FormField
                      control={form.control}
                      name="schemaType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schema Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || "BlogPosting"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select schema type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Article">Article</SelectItem>
                              <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                              <SelectItem value="HowTo">How-To</SelectItem>
                              <SelectItem value="FAQPage">FAQ Page</SelectItem>
                              <SelectItem value="MedicalWebPage">Medical Web Page</SelectItem>
                              <SelectItem value="Product">Product</SelectItem>
                              <SelectItem value="Custom">Custom (Advanced)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Determines the auto-generated JSON-LD structured data type for this post.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customSchema"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom JSON-LD</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  "headline": "..."\n}'}
                              className="h-48 font-mono text-xs resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Paste valid JSON-LD here. This overrides the auto-generated schema when filled in.
                            Leave blank to use auto-generated schema.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                {/* ── 4. SEO Analysis (Read-only) ── */}
                <Collapsible open={openSections.analysis} onOpenChange={() => toggleSection("analysis")}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between px-0 font-semibold text-sm hover:bg-transparent">
                      <span className="flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5" /> SEO Analysis</span>
                      {openSections.analysis ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 pb-4 space-y-3">
                    {metrics == null || (metrics.seoScore == null && metrics.seoFeedback == null && metrics.readingTime == null) ? (
                      <p className="text-sm text-muted-foreground">
                        Save the post to calculate SEO score and metrics.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {metrics.seoScore != null && (
                          <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm font-medium">SEO Score</span>
                            <span className={`text-sm font-bold px-2 py-0.5 rounded ${seoScoreColor}`}>
                              {metrics.seoScore}/100
                            </span>
                          </div>
                        )}
                        {metrics.readingTime != null && (
                          <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm font-medium">Reading Time</span>
                            <span className="text-sm text-muted-foreground">{metrics.readingTime} min</span>
                          </div>
                        )}
                        {metrics.wordCount != null && (
                          <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm font-medium">Word Count</span>
                            <span className="text-sm text-muted-foreground">{metrics.wordCount.toLocaleString()}</span>
                          </div>
                        )}
                        {metrics.aiScore != null && (
                          <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm font-medium flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-purple-500" /> AI Optimisation Score
                            </span>
                            <span className="text-sm text-muted-foreground">{metrics.aiScore}/100</span>
                          </div>
                        )}
                        {metrics.seoFeedback && (
                          <div className="rounded-md border p-3 bg-muted/30">
                            <p className="text-xs font-medium mb-1 text-muted-foreground uppercase tracking-wide">Feedback</p>
                            <p className="text-sm">{metrics.seoFeedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

              </CardContent>
            </Card>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Publishing */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "__none__"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">— None —</SelectItem>
                          {POST_CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          {field.value ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                              <Image src={field.value} alt="Featured" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute right-2 top-2"
                                onClick={() => {
                                  field.onChange("");
                                  setFeaturedImageId(null);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="flex aspect-video w-full flex-col items-center justify-center rounded-md border border-dashed bg-muted/20">
                              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">No image selected</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                            onChange={(e) => handleImageUpload(e, "featured")}
                            disabled={isUploading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            disabled={isUploading}
                            onClick={() => document.getElementById("image-upload")?.click()}
                          >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Image"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Hair, Treatment, Cost" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Metrics summary in sidebar */}
            {metrics && (metrics.readingTime != null || metrics.wordCount != null) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Content Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {metrics.readingTime != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reading time</span>
                      <span className="font-medium">{metrics.readingTime} min</span>
                    </div>
                  )}
                  {metrics.wordCount != null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Word count</span>
                      <span className="font-medium">{metrics.wordCount.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
