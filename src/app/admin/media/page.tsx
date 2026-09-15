"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaService, type MediaDoc, type MediaUsage, type UsagePage } from "@/lib/api/media.service";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Loader2, Upload, Trash, Copy, Image as ImageIcon, Info,
  ExternalLink, AlertCircle, RefreshCw, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "American Hairline";

function absoluteUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return APP_URL ? `${APP_URL.replace(/\/$/, "")}${url}` : url;
}

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectionTokenRef = useRef(0);

  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<MediaDoc | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState({ title: "", altText: "", caption: "", description: "" });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showUnusedOnly, setShowUnusedOnly] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [usageData, setUsageData] = useState<MediaUsage | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [uploadAltText, setUploadAltText] = useState("");
  const [showUploadAltPrompt, setShowUploadAltPrompt] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);

  // Fetch media list
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["media", page, showUnusedOnly],
    queryFn: () =>
      showUnusedOnly
        ? mediaService.getUnusedMedia()
        : mediaService.getMedia({ page, limit: 20 }),
  });

  type UnusedResult = { success: true; data: { media: MediaDoc[]; meta: { total: number; pages: number; page: number; limit: number }; scannedFields: string[]; note: string } };
  const unusedNote = showUnusedOnly && (data as UnusedResult | undefined)?.data?.note
    ? (data as UnusedResult).data.note
    : null;

  const deleteMutation = useMutation({
    mutationFn: mediaService.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setSelectedImage(null);
      toast({ title: "Image deleted" });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: mediaService.deleteBulkMedia,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setSelectedItems([]);
      setIsSelectionMode(false);
      const { deletedCount, failedIds, blockedIds } = res.data;
      const issues: string[] = [];
      if (failedIds.length > 0) issues.push(`${failedIds.length} failed (server error)`);
      if (blockedIds.length > 0) issues.push(`${blockedIds.length} blocked (in use)`);
      if (issues.length > 0) {
        toast({
          title: `${deletedCount} deleted — ${issues.join(", ")}`,
          description: blockedIds.length > 0
            ? `In-use images were not deleted. Remove their references first.`
            : `Failed IDs: ${failedIds.join(", ")}`,
          variant: "destructive",
        });
      } else {
        toast({ title: `${deletedCount} image${deletedCount !== 1 ? "s" : ""} deleted` });
      }
    },
    onError: () => toast({ title: "Bulk delete failed", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      mediaService.updateMedia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast({ title: "Metadata saved" });
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const onSelectImage = async (item: MediaDoc) => {
    const token = ++selectionTokenRef.current;
    setSelectedImage(item);
    setEditData({
      title: item.title || "",
      altText: item.altText || "",
      caption: item.caption || "",
      description: item.description || "",
    });
    setUsageData(null);
    setUsageError(null);
    setUsageLoading(true);
    setActiveTab("edit");

    const result = await mediaService.getMediaUsage(item.id);
    if (token !== selectionTokenRef.current) return; // stale response — discard
    setUsageLoading(false);
    if (result.success) {
      setUsageData(result.data);
    } else {
      setUsageError(result.error);
    }
  };

  const doUpload = async (files: FileList, altText: string) => {
    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      try {
        const res = await mediaService.uploadFile(files[i], altText);
        if (res.success) {
          successCount++;
        } else {
          toast({
            title: `Upload failed: ${files[i].name}`,
            description: res.message || "Server rejected this file.",
            variant: "destructive",
          });
        }
      } catch (err) {
        const msg = err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Unexpected upload error";
        toast({ title: `Upload failed: ${files[i].name}`, description: msg, variant: "destructive" });
      }
    }

    setIsUploading(false);
    queryClient.invalidateQueries({ queryKey: ["media"] });

    if (successCount > 0) {
      toast({
        title: "Upload complete",
        description: `${successCount} of ${files.length} image${files.length !== 1 ? "s" : ""} uploaded successfully.`,
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setPendingFiles(files);
    setUploadAltText("");
    setShowUploadAltPrompt(true);
  };

  const handleUploadConfirm = async () => {
    setShowUploadAltPrompt(false);
    if (pendingFiles) {
      await doUpload(pendingFiles, uploadAltText);
      setPendingFiles(null);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleUpdate = async () => {
    if (selectedImage) {
      await updateMutation.mutateAsync({ id: selectedImage.id, data: editData });
    }
  };

  const copyToClipboard = async (text: string, label = "URL") => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied to clipboard` });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const mediaItems: MediaDoc[] = Array.isArray(data?.data?.media) ? data.data.media : [];
  const meta = data?.data?.meta || { total: 0, pages: 1 };
  const totalPages = Number((meta as { pages?: unknown }).pages ?? 1) || 1;
  const totalCount = Number((meta as { total?: unknown }).total ?? 0);

  const canDelete = usageData !== null && usageData.totalCount === 0;
  const isUsageLoaded = !usageLoading && usageData !== null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        subtitle={
          showUnusedOnly
            ? "Showing images not referenced by posts or products."
            : `${totalCount} image${totalCount !== 1 ? "s" : ""} in the library.`
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant={showUnusedOnly ? "secondary" : "outline"}
              onClick={() => { setShowUnusedOnly(!showUnusedOnly); setPage(1); }}
            >
              <Info className="mr-2 h-4 w-4" />
              {showUnusedOnly ? "Show All" : "Unused Images"}
            </Button>

            {isSelectionMode ? (
              <>
                <span className="flex items-center text-sm font-medium mr-2">
                  {selectedItems.length} selected
                </span>
                <Button variant="outline" onClick={() => { setIsSelectionMode(false); setSelectedItems([]); }}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={selectedItems.length === 0 || bulkDeleteMutation.isPending}
                  onClick={() => setIsBulkDeleteDialogOpen(true)}
                >
                  {bulkDeleteMutation.isPending
                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    : <Trash className="mr-2 h-4 w-4" />}
                  Delete Selected
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsSelectionMode(true)}>
                Select Multiple
              </Button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              id="media-upload"
              onChange={handleFileSelected}
              disabled={isUploading}
              accept="image/*"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Upload className="mr-2 h-4 w-4" />}
              Upload Images
            </Button>
          </div>
        }
      />

      {/* Unused audit notice */}
      {showUnusedOnly && unusedNote && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">{unusedNote}</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-lg bg-red-50">
          <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
          <h3 className="text-base font-medium text-red-700">Failed to load media</h3>
          <p className="text-sm text-red-500 mb-4">Check your connection or server logs.</p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && mediaItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-slate-50">
          <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">
            {showUnusedOnly ? "No unused images found" : "No images yet"}
          </h3>
          <p className="text-slate-500 mb-6">
            {showUnusedOnly
              ? "All uploaded images are referenced somewhere."
              : "Upload images to get started"}
          </p>
          {!showUnusedOnly && (
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Upload Images
            </Button>
          )}
        </div>
      )}

      {/* Media grid */}
      {!isLoading && !isError && mediaItems.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden cursor-pointer group hover:ring-2 hover:ring-indigo-500 transition-all"
                onClick={() => !isSelectionMode && onSelectImage(item)}
              >
                <div className="aspect-square bg-slate-100 relative">
                  <Image
                    src={item.url}
                    alt={item.altText || item.filename}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  {isSelectionMode && (
                    <div
                      className="absolute top-2 left-2"
                      onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleSelection(item.id)}
                        className="bg-white border-slate-300"
                      />
                    </div>
                  )}

                  {selectedItems.includes(item.id) && !isSelectionMode && (
                    <div className="absolute top-2 left-2">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate text-slate-700" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : ""}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Upload alt text prompt */}
      <Dialog open={showUploadAltPrompt} onOpenChange={(open) => { if (!open) { setShowUploadAltPrompt(false); setPendingFiles(null); if (fileInputRef.current) fileInputRef.current.value = ""; } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Alt Text Before Uploading</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-slate-500">
              {pendingFiles?.length === 1
                ? `Uploading: ${pendingFiles[0].name}`
                : `Uploading ${pendingFiles?.length ?? 0} images`}
            </p>
            <div className="space-y-1">
              <Label htmlFor="upload-alt">Alt Text <span className="text-slate-400 text-xs">(used for all selected images)</span></Label>
              <Input
                id="upload-alt"
                placeholder="e.g. Hair system before and after"
                value={uploadAltText}
                onChange={(e) => setUploadAltText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUploadConfirm()}
                autoFocus
              />
              <p className="text-xs text-slate-400">Leave blank to use the filename as alt text.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowUploadAltPrompt(false); setPendingFiles(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
              Cancel
            </Button>
            <Button onClick={handleUploadConfirm}>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image detail modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{selectedImage?.filename}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left — preview + file info */}
            <div className="space-y-4">
              <div className="bg-slate-100 rounded-lg flex items-center justify-center p-4 min-h-[280px]">
                {selectedImage && (
                  <div className="relative h-[400px] w-full">
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.altText || "Preview"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <div className="text-sm bg-slate-50 p-3 rounded-lg space-y-1">
                {([
                  ["Type", selectedImage?.mimeType ?? ""],
                  ["Size", selectedImage?.filesize ? `${(selectedImage.filesize / 1024).toFixed(1)} KB` : "—"],
                  ...(selectedImage?.width ? [["Dimensions", `${selectedImage.width} × ${selectedImage.height}px`]] : []),
                  ["Uploaded", selectedImage?.createdAt ? format(new Date(selectedImage.createdAt), "MMM d, yyyy") : "—"],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="grid grid-cols-3 gap-2 py-0.5">
                    <span className="text-slate-500">{label}</span>
                    <span className="col-span-2 font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {/* URL copy — relative and absolute */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input readOnly value={selectedImage?.url || ""} className="text-xs font-mono bg-white" title="Relative URL" />
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(selectedImage?.url || "", "Relative URL")} title="Copy relative URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {APP_URL && selectedImage?.url && (
                  <div className="flex gap-2">
                    <Input readOnly value={absoluteUrl(selectedImage.url)} className="text-xs font-mono bg-white text-slate-400" title="Absolute URL" />
                    <Button size="icon" variant="outline" onClick={() => copyToClipboard(absoluteUrl(selectedImage!.url), "Absolute URL")} title="Copy absolute URL">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant="destructive"
                className="w-full"
                disabled={!isUsageLoaded || usageLoading || (isUsageLoaded && (usageData?.totalCount ?? 0) > 0)}
                onClick={() => {
                  if (isUsageLoaded && usageData && usageData.totalCount > 0) {
                    toast({
                      title: "Image is in use",
                      description: `Used in ${usageData.totalCount} place${usageData.totalCount !== 1 ? "s" : ""}. Remove those references before deleting.`,
                      variant: "destructive",
                    });
                    return;
                  }
                  setDeleteId(selectedImage?.id ?? null);
                  setSelectedImage(null);
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete Permanently
              </Button>

              {isUsageLoaded && usageData && usageData.totalCount > 0 && (
                <p className="text-xs text-center text-amber-600">
                  Remove all references before deleting.
                </p>
              )}
            </div>

            {/* Right — tabs */}
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="edit">Metadata</TabsTrigger>
                  <TabsTrigger value="usage">
                    Usage
                    {isUsageLoaded && usageData && usageData.totalCount > 0 && (
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1">
                        {usageData.totalCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="seo">JSON-LD</TabsTrigger>
                </TabsList>

                {/* Metadata tab */}
                <TabsContent value="edit" className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="media-title">Title</Label>
                    <Input id="media-title" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="media-alt">
                      Alt Text
                      {!editData.altText && (
                        <span className="ml-2 text-xs text-amber-500">Missing — important for SEO</span>
                      )}
                    </Label>
                    <Input id="media-alt" value={editData.altText} onChange={(e) => setEditData({ ...editData, altText: e.target.value })} placeholder="Describe this image for screen readers" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="media-caption">Caption</Label>
                    <Textarea id="media-caption" rows={2} value={editData.caption} onChange={(e) => setEditData({ ...editData, caption: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="media-desc">Description</Label>
                    <Textarea id="media-desc" rows={3} value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                  </div>
                  <Button className="w-full" onClick={handleUpdate} disabled={updateMutation.isPending}>
                    {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </TabsContent>

                {/* Usage tab */}
                <TabsContent value="usage" className="space-y-4">
                  <h3 className="font-medium">Where is this image used?</h3>

                  {usageLoading && (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                    </div>
                  )}

                  {usageError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-700">Could not load usage data: {usageError}</p>
                    </div>
                  )}

                  {!usageLoading && !usageError && usageData !== null && usageData.totalCount === 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <h4 className="text-amber-800 font-medium flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4" /> No references found
                      </h4>
                      <p className="text-amber-700 text-xs mt-1">
                        Not found in posts, products, or pages (URL fields, block data, or HTML content). Custom head/footer scripts are not scanned.
                      </p>
                    </div>
                  )}

                  {!usageLoading && !usageError && usageData !== null && usageData.totalCount > 0 && (
                    <div className="space-y-4">
                      {usageData.posts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 border-b pb-1">
                            Posts ({usageData.posts.length})
                          </h4>
                          <ul className="text-sm space-y-1">
                            {usageData.posts.map((p) => (
                              <li key={`${p.id}-${p.field}`} className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded gap-2">
                                <span className="truncate flex-1">{p.title}</span>
                                <Badge variant="outline" className="text-[10px] shrink-0">{p.field}</Badge>
                                {p.slug && (
                                  <a
                                    href={`/blog/${p.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 shrink-0"
                                    title="View post"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {usageData.products.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 border-b pb-1">
                            Products ({usageData.products.length})
                          </h4>
                          <ul className="text-sm space-y-1">
                            {usageData.products.map((p) => (
                              <li key={p.id} className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded gap-2">
                                <span className="truncate flex-1">{p.name}</span>
                                {p.slug && (
                                  <a
                                    href={`/products/${p.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 shrink-0"
                                    title="View product"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {usageData.pages && usageData.pages.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 border-b pb-1">
                            Pages ({usageData.pages.length})
                          </h4>
                          <ul className="text-sm space-y-1">
                            {usageData.pages.map((pg: UsagePage) => (
                              <li key={`${pg.id}-${pg.field}`} className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded gap-2">
                                <span className="truncate flex-1">{pg.title}</span>
                                <Badge variant="outline" className="text-[10px] shrink-0">{pg.field}</Badge>
                                {pg.slug && (
                                  <a
                                    href={`/${pg.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 shrink-0"
                                    title="View page"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-xs text-slate-400">
                        All known reference locations are scanned, including custom head/footer scripts.
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* JSON-LD tab */}
                <TabsContent value="seo" className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-1">JSON-LD Schema</h3>
                    <p className="text-xs text-slate-500">Copy into your page &lt;head&gt; for Google Image search structured data.</p>
                  </div>
                  <pre className="text-[10px] bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto max-h-[280px] font-mono whitespace-pre-wrap">
                    {JSON.stringify(
                      {
                        "@context": "https://schema.org/",
                        "@type": "ImageObject",
                        contentUrl: selectedImage ? absoluteUrl(selectedImage.url) : "",
                        description: selectedImage?.description || selectedImage?.altText || "",
                        name: selectedImage?.title || selectedImage?.filename || "",
                        creator: {
                          "@type": "Organization",
                          name: SITE_NAME,
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(
                          {
                            "@context": "https://schema.org/",
                            "@type": "ImageObject",
                            contentUrl: selectedImage ? absoluteUrl(selectedImage.url) : "",
                            description: selectedImage?.description || selectedImage?.altText || "",
                            name: selectedImage?.title || selectedImage?.filename || "",
                            creator: { "@type": "Organization", name: SITE_NAME },
                          },
                          null,
                          2
                        ),
                        "JSON-LD"
                      )
                    }
                  >
                    <Copy className="mr-2 h-3 w-3" /> Copy JSON-LD
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Image"
        description="Are you sure you want to permanently delete this image? This cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />

      <ConfirmDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        title="Delete Selected Images"
        description={
          `Permanently delete ${selectedItems.length} image${selectedItems.length !== 1 ? "s" : ""}? ` +
          `Images that are currently in use will be skipped automatically. This cannot be undone.`
        }
        onConfirm={async () => {
          await bulkDeleteMutation.mutateAsync(selectedItems);
          setIsBulkDeleteDialogOpen(false);
        }}
        isLoading={bulkDeleteMutation.isPending}
        variant="destructive"
        confirmText="Delete All"
      />
    </div>
  );
}
