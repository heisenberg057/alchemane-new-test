"use client";

import { useCallback, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";

type AiGenerateKind = "title" | "description";

export type AiGenerateButtonProps = {
  type: AiGenerateKind;
  postId?: string;
  pageId?: string;
  content?: string;
  title?: string;
  onAccept: (value: string) => void;
};

type ApiBody = {
  postId?: string;
  pageId?: string;
  title?: string;
  content?: string;
};

export function AiGenerateButton({
  type,
  postId,
  pageId,
  content = "",
  title = "",
  onAccept,
}: AiGenerateButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const buildBody = useCallback((): ApiBody => {
    const b: ApiBody = {
      title: title?.trim() || undefined,
      content: content?.trim() || undefined,
    };
    if (postId) b.postId = postId;
    if (pageId) b.pageId = pageId;
    return b;
  }, [title, content, postId, pageId]);

  const validateBody = useCallback((body: ApiBody) => {
    return [body.title, body.content].some((x) => x?.trim());
  }, []);

  const fetchSuggestion = useCallback(async () => {
    const body = buildBody();
    if (!validateBody(body)) {
      toast({
        title: "Nothing to send",
        description: "Add a title or body content first.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setSuggestion(null);
    setInlineError(null);
    try {
      const path =
        type === "title"
          ? "/ai-seo/generate/seo-title"
          : "/ai-seo/generate/meta-description";
      const { data } = await apiClient.post<{
        success?: boolean;
        message?: string;
        data?: { title?: string; metaDescription?: string };
      }>(path, body);
      if (data?.success === false) {
        throw new Error(data?.message || "Request failed");
      }
      const inner = data?.data;
      const text =
        type === "title" ? inner?.title : inner?.metaDescription;
      if (typeof text !== "string" || !text.trim()) {
        throw new Error("Empty response from AI");
      }
      setSuggestion(text.trim());
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      setInlineError(msg);
      toast({ title: "AI generation failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [buildBody, validateBody, type, toast]);

  const handleOpenClick = () => {
    const body = buildBody();
    if (!validateBody(body)) {
      toast({
        title: "Nothing to send",
        description: "Add a title or body content first.",
        variant: "destructive",
      });
      return;
    }
    setInlineError(null);
    setSuggestion(null);
    setOpen(true);
    void fetchSuggestion();
  };

  const handleUse = () => {
    if (suggestion == null) return;
    onAccept(suggestion);
    setOpen(false);
    setSuggestion(null);
    setInlineError(null);
  };

  const handleDismiss = () => {
    setOpen(false);
    setSuggestion(null);
    setInlineError(null);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSuggestion(null);
          setInlineError(null);
        }
      }}
    >
      <PopoverAnchor asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleOpenClick}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
          )}
          Generate with AI
        </Button>
      </PopoverAnchor>
      <PopoverContent
        align="end"
        side="bottom"
        className="w-[min(100vw-2rem,24rem)] space-y-3 p-4"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            Generating…
          </div>
        )}
        {!loading && inlineError && !suggestion && (
          <div className="space-y-2">
            <p className="text-sm text-destructive">{inlineError}</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void fetchSuggestion()}
            >
              Try again
            </Button>
          </div>
        )}
        {!loading && suggestion != null && (
          <>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Suggestion
              </p>
              <p className="text-sm leading-snug whitespace-pre-wrap break-words rounded-md border bg-muted/30 p-2">
                {suggestion}
              </p>
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {suggestion.length} characters
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={handleUse}>
                Use This
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void fetchSuggestion()}
                disabled={loading}
              >
                Regenerate
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
              >
                Dismiss
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
