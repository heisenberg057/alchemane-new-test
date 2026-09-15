"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreatePage, useUpdatePage, usePage } from "@/lib/hooks/usePages";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, Image as ImageIcon, Search, Globe, Share2, Code } from "lucide-react";
import Link from "next/link";
import { mediaService } from "@/lib/api/media.service";
import { VisualEditor } from "./editor/VisualEditor";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { blocksToPlainText } from "@/lib/utils/blocksToPlainText";
import { AiGenerateButton } from "@/components/admin/AiGenerateButton";

// Schema definition matching prisma Page model
const pageSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featuredImage: z.string().optional(),
  
  focusKeyword: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  
  ogTitle: z.string().max(95).optional(),
  ogDescription: z.string().max(200).optional(),
  ogImage: z.string().optional(),
  
  twitterTitle: z.string().max(70).optional(),
  twitterDescription: z.string().max(200).optional(),
  twitterImage: z.string().optional(),
  
  isIndexable: z.boolean(),
  isFollowable: z.boolean(),
  advancedRobots: z.string().optional(),
  
  enableSchema: z.boolean(),
  customSchema: z.string().optional(),
  
  content: z.string().optional(),
  headerStyle: z.enum(["default", "hidden", "transparent"]),
  footerStyle: z.enum(["default", "hidden"]),
  showSidebar: z.boolean(),
  customHeadScripts: z.string().optional(),
  customFooterScripts: z.string().optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

interface PageEditorProps {
  pageId?: string;
}

export default function PageEditor({ pageId }: PageEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isVisualEditorOpen, setIsVisualEditorOpen] = useState(false);
  
  const { blocks, setBlocks, resetEditor } = useEditorStore();

  const { data: pageData, isLoading: isLoadingPage, isError: isPageError, error: pageError } = usePage(
    pageId || ""
  );
  const page = pageData;
  const createMutation = useCreatePage();
  const updateMutation = useUpdatePage();

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "DRAFT",
      featuredImage: "",
      focusKeyword: "",
      seoTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      isIndexable: true,
      isFollowable: true,
      advancedRobots: "",
      enableSchema: true,
      customSchema: "",
      content: "",
      headerStyle: "default",
      footerStyle: "default",
      showSidebar: false,
      customHeadScripts: "",
      customFooterScripts: "",
    },
  });

  const watchedTitle = form.watch("title");
  const contentForAi = useMemo(() => blocksToPlainText(blocks), [blocks]);

  // Reset editor state whenever the target page changes (including new-page route).
  // This prevents blocks/history/selection from a previous record leaking into the next.
  useEffect(() => {
    resetEditor();
  }, [pageId, resetEditor]);

  useEffect(() => {
    if (page) {
      const p = page as Record<string, unknown>;
      const status =
        p.status === "PUBLISHED" || p.status === "DRAFT" ? p.status : "DRAFT";
      form.reset({
        title: String(p.title ?? ""),
        slug: String(p.slug ?? ""),
        status,
        featuredImage: String(p.featuredImage ?? ""),
        focusKeyword: String(p.focusKeyword ?? ""),
        seoTitle: String(p.seoTitle ?? ""),
        metaDescription: String(p.metaDescription ?? ""),
        canonicalUrl: String(p.canonicalUrl ?? ""),
        ogTitle: String(p.ogTitle ?? ""),
        ogDescription: String(p.ogDescription ?? ""),
        ogImage: String(p.ogImage ?? ""),
        twitterTitle: String(p.twitterTitle ?? ""),
        twitterDescription: String(p.twitterDescription ?? ""),
        twitterImage: String(p.twitterImage ?? ""),
        isIndexable: p.isIndexable !== false,
        isFollowable: p.isFollowable !== false,
        advancedRobots: String(p.advancedRobots ?? ""),
        enableSchema: p.enableSchema !== false,
        customSchema: String(p.customSchema ?? ""),
        content: String(p.content ?? ""),
        headerStyle: (["default", "hidden", "transparent"].includes(String(p.headerStyle)) ? String(p.headerStyle) : "default") as "default" | "hidden" | "transparent",
        footerStyle: (["default", "hidden"].includes(String(p.footerStyle)) ? String(p.footerStyle) : "default") as "default" | "hidden",
        showSidebar: Boolean(p.showSidebar),
        customHeadScripts: String(p.customHeadScripts ?? ""),
        customFooterScripts: String(p.customFooterScripts ?? ""),
      });

      try {
        if (p.blocksData) {
          const parsed =
            typeof p.blocksData === "string"
              ? JSON.parse(p.blocksData)
              : p.blocksData;
          setBlocks(Array.isArray(parsed) ? parsed : (parsed.blocks || []));
        }
        // If no blocksData, resetEditor already cleared blocks above — nothing more to do.
      } catch {
        // Malformed blocksData — editor stays empty (already reset).
      }
    }
  }, [page, form, setBlocks]);

  useEffect(() => {
    if (!pageId && watchedTitle) {
      const slug = watchedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      form.setValue("slug", slug);
      if (!form.getValues('seoTitle')) form.setValue('seoTitle', watchedTitle);
    }
  }, [watchedTitle, pageId, form]);

  const onSubmit = async (values: PageFormValues) => {
    try {
      const payload = {
        ...values,
        blocksData: JSON.stringify(blocks),
      };

      if (pageId) {
        await updateMutation.mutateAsync({ id: pageId, data: payload });
        toast({ title: "Success", description: "Page updated successfully." });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Success", description: "Page created successfully." });
        router.push("/admin/pages");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save page.", variant: "destructive" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const altText = window.prompt("Enter alt text for this image (recommended for accessibility and SEO):", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")) ?? file.name;

    setIsUploading(true);
    try {
      const res = await mediaService.uploadFile(file, altText);
      if (res.success) {
        const imageUrl = res.data?.media?.[0]?.url || res.data?.url;
        form.setValue(fieldName as Parameters<typeof form.setValue>[0], imageUrl);
        toast({ title: "Image uploaded" });
      } else {
        toast({ title: "Upload failed", description: "The server did not accept the file.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  if (pageId && isLoadingPage) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (pageId && isPageError) {
    return (
      <div className="mx-auto max-w-lg rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-sm">
        <p className="font-medium text-destructive">Could not load this page</p>
        <p className="mt-2 text-destructive/90">
          {pageError instanceof Error ? pageError.message : "Request failed."}
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin/pages">Back to Pages</Link>
        </Button>
      </div>
    );
  }

  const seoTitle = form.watch("seoTitle") || form.watch("title") || "Page Title";
  const seoDesc = form.watch("metaDescription") || "Please provide a meta description for search engines to display in the SERP snipper.";
  const pageSlug = form.watch("slug") || "page-slug";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PageHeader
          title={pageId ? "Edit Page" : "Add New Page"}
          actions={
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/admin/pages"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages</Link>
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {pageId ? "Update Page" : "Publish Page"}
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 h-auto p-1 bg-muted/50 gap-1 overflow-x-auto justify-start border border-border">
                <TabsTrigger value="content" className="py-2.5 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"><ImageIcon className="w-4 h-4 mr-2"/> Design & Content</TabsTrigger>
                <TabsTrigger value="seo" className="py-2.5 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"><Search className="w-4 h-4 mr-2"/> SEO Settings</TabsTrigger>
                <TabsTrigger value="social" className="py-2.5 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"><Share2 className="w-4 h-4 mr-2"/> Social Preview</TabsTrigger>
                <TabsTrigger value="advanced" className="py-2.5 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"><Globe className="w-4 h-4 mr-2"/> Advanced Meta</TabsTrigger>
                <TabsTrigger value="settings" className="py-2.5 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"><Code className="w-4 h-4 mr-2"/> Scripts & Layout</TabsTrigger>
              </TabsList>

              {/* ------------- TAB: CONTENT ------------- */}
              <TabsContent value="content" className="space-y-6 mt-0">
                <Card className="border-border">
                  <CardContent className="pt-6 space-y-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Title</FormLabel>
                        <FormControl><Input placeholder="Enter page title" className="text-xl font-bold h-12" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="slug" render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl><Input placeholder="e.g. hair-replacement-services" {...field} /></FormControl>
                        <FormDescription>Warning: Changing this will affect live URLs and rankings.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormItem>
                      <FormLabel className="flex justify-between items-center mb-2">
                        <span className="text-base font-semibold">Page Content</span>
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded border border-indigo-200">Visual Builder Active</span>
                      </FormLabel>
                      {isVisualEditorOpen ? (
                        <div className="fixed inset-0 z-[100] bg-[#131415] w-screen h-screen flex flex-col">
                           <VisualEditor onClose={() => setIsVisualEditorOpen(false)} />
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50/50 p-16 flex flex-col items-center justify-center gap-4 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer" onClick={() => setIsVisualEditorOpen(true)}>
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                            <ImageIcon className="w-8 h-8 text-[#e31c58]" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-lg text-gray-900 mb-1">Edit with Visual Builder</p>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">Create beautiful layouts, add forms, tables, and media using our drag-and-drop canvas.</p>
                          </div>
                          <Button type="button" variant="outline" className="mt-2 bg-white font-semibold">
                            Open Workspace
                          </Button>
                        </div>
                      )}
                    </FormItem>

                    <FormField control={form.control} name="content" render={({ field }) => (
                      <FormItem>
                        <FormLabel>HTML Content Fallback</FormLabel>
                        <FormControl>
                          <Textarea
                            className="font-mono text-sm h-40 bg-gray-50"
                            placeholder="<p>Raw HTML rendered when no visual builder blocks are present.</p>"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Used only when the Visual Builder has no blocks. Supports basic HTML.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------- TAB: SEO ------------- */}
              <TabsContent value="seo" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Engine Optimization</CardTitle>
                    <CardDescription>Optimize how this page appears in Google Search results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* SERP Preview */}
                    <div className="bg-white border rounded-xl p-5 shadow-sm max-w-2xl mb-8">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Google Preview</p>
                      <div className="flex flex-col gap-1">
                        <div className="text-[14px] text-[#202124] flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-200 block"></span>
                          <span>https://americanhairline.com › {pageSlug}</span>
                        </div>
                        <h3 className="text-[20px] text-[#1a0dab] font-medium hover:underline cursor-pointer">{seoTitle}</h3>
                        <p className="text-[14px] text-[#4d5156] leading-snug">{seoDesc}</p>
                      </div>
                    </div>

                    <FormField control={form.control} name="focusKeyword" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Focus Keyphrase</FormLabel>
                        <FormControl><Input placeholder="e.g. Non Surgical Hair Replacement" {...field} /></FormControl>
                        <FormDescription>The main keyword you want to rank for.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="seoTitle" render={({ field }) => (
                      <FormItem>
                        <div className="flex w-full items-center justify-between gap-2">
                          <FormLabel className="!mt-0">SEO Title</FormLabel>
                          <AiGenerateButton
                            type="title"
                            pageId={pageId}
                            title={watchedTitle}
                            content={contentForAi}
                            onAccept={(val) => form.setValue("seoTitle", val)}
                          />
                        </div>
                        <FormControl><Input placeholder="Title that appears in Search Engines" {...field} /></FormControl>
                        <div className="flex justify-between mt-1 items-center">
                           <FormDescription>If empty, Page Title is used.</FormDescription>
                           <span className={`text-xs ${(field.value?.length || 0) > 60 ? 'text-red-500' : 'text-green-600'}`}>
                             {field.value?.length || 0}/60
                           </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="metaDescription" render={({ field }) => (
                      <FormItem>
                        <div className="flex w-full items-center justify-between gap-2">
                          <FormLabel className="!mt-0">Meta Description</FormLabel>
                          <AiGenerateButton
                            type="description"
                            pageId={pageId}
                            title={watchedTitle}
                            content={contentForAi}
                            onAccept={(val) => form.setValue("metaDescription", val)}
                          />
                        </div>
                        <FormControl><Textarea className="h-24 resize-none" placeholder="Write a compelling brief description to increase CTR..." {...field} /></FormControl>
                        <div className="flex justify-between mt-1 items-center">
                           <FormDescription>Optimal length is around 150-160 characters.</FormDescription>
                           <span className={`text-xs ${(field.value?.length || 0) > 160 ? 'text-red-500' : 'text-green-600'}`}>
                             {field.value?.length || 0}/160
                           </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------- TAB: SOCIAL ------------- */}
              <TabsContent value="social" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Facebook (Open Graph)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField control={form.control} name="ogImage" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook Image</FormLabel>
                        <FormControl>
                          <div className="flex gap-4 items-start">
                            {field.value && (
                              <div className="w-48 h-24 relative rounded overflow-hidden border">
                                <Image src={field.value} alt="OG Preview" fill className="object-cover" sizes="192px" />
                              </div>
                            )}
                            <div className="flex-1">
                              <Input type="file" onChange={(e) => handleImageUpload(e, "ogImage")} disabled={isUploading} accept="image/*" />
                              <FormDescription className="mt-1">Recommended format: 1200x630px.</FormDescription>
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="ogTitle" render={({ field }) => (
                        <FormItem><FormLabel>Facebook Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="ogDescription" render={({ field }) => (
                        <FormItem><FormLabel>Facebook Description</FormLabel><FormControl><Textarea className="h-10" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Twitter (X)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField control={form.control} name="twitterImage" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Image</FormLabel>
                        <FormControl>
                          <div className="flex gap-4 items-start">
                            {field.value && (
                              <div className="w-48 h-24 relative rounded overflow-hidden border">
                                <Image src={field.value} alt="Twitter Preview" fill className="object-cover" sizes="192px" />
                              </div>
                            )}
                            <div className="flex-1">
                              <Input type="file" onChange={(e) => handleImageUpload(e, "twitterImage")} disabled={isUploading} accept="image/*" />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="twitterTitle" render={({ field }) => (
                        <FormItem><FormLabel>Twitter Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="twitterDescription" render={({ field }) => (
                        <FormItem><FormLabel>Twitter Description</FormLabel><FormControl><Textarea className="h-10" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------- TAB: ADVANCED ------------- */}
              <TabsContent value="advanced" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                     <CardTitle>Robots & Indexing Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <FormField control={form.control} name="isIndexable" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Search Engines to index this Page?</FormLabel>
                          <FormDescription>If disabled, adds <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-red-600">noindex</code> to robots meta.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="isFollowable" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Search Engines to follow links?</FormLabel>
                          <FormDescription>If disabled, adds <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-red-600">nofollow</code>.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <FormField control={form.control} name="advancedRobots" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advanced Robots Meta</FormLabel>
                          <FormControl><Input placeholder="e.g. noarchive, nosnippet, max-snippet:-1" {...field} /></FormControl>
                          <FormDescription>Comma separated list for advanced crawled directives.</FormDescription>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="canonicalUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Canonical URL</FormLabel>
                          <FormControl><Input placeholder="e.g. https://americanhairline.com/original-page" {...field} /></FormControl>
                          <FormDescription>Overrides the default canonical URL pointing to itself.</FormDescription>
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center justify-between">
                       <span>Schema (JSON-LD)</span>
                       <FormField control={form.control} name="enableSchema" render={({ field }) => (
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-normal text-muted-foreground mr-2">Enable Schema</span>
                           <Switch checked={field.value} onCheckedChange={field.onChange} />
                         </div>
                       )} />
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField control={form.control} name="customSchema" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom JSON-LD Profile</FormLabel>
                        <FormControl>
                          <Textarea className="font-mono text-sm h-48 bg-gray-900 text-green-400 p-4" placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page Name"\n}'} {...field} />
                        </FormControl>
                        <FormDescription>Paste raw, valid JSON to inject into the head for rich results.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------- TAB: SETTINGS ------------- */}
              <TabsContent value="settings" className="space-y-6 mt-0">
                <Card>
                  <CardHeader><CardTitle>Layout Overrides</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <FormField control={form.control} name="headerStyle" render={({ field }) => (
                         <FormItem>
                           <FormLabel>Header Style</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                             <FormControl><SelectTrigger><SelectValue placeholder="Select Style"/></SelectTrigger></FormControl>
                             <SelectContent>
                               <SelectItem value="default">Default Header (Nav)</SelectItem>
                               <SelectItem value="transparent">Transparent Over Hero</SelectItem>
                               <SelectItem value="hidden">Hide Header Completely</SelectItem>
                             </SelectContent>
                           </Select>
                         </FormItem>
                       )} />

                       <FormField control={form.control} name="footerStyle" render={({ field }) => (
                         <FormItem>
                           <FormLabel>Footer Style</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                             <FormControl><SelectTrigger><SelectValue placeholder="Select Style"/></SelectTrigger></FormControl>
                             <SelectContent>
                               <SelectItem value="default">Default Footer</SelectItem>
                               <SelectItem value="hidden">Hide Footer Completely</SelectItem>
                             </SelectContent>
                           </Select>
                         </FormItem>
                       )} />
                    </div>

                    <FormField control={form.control} name="showSidebar" render={({ field }) => (
                       <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
                         <div>
                            <FormLabel className="text-base">Toggle Page Sidebar</FormLabel>
                            <FormDescription>Shows Global Blog Sidebar</FormDescription>
                         </div>
                         <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                       </FormItem>
                    )} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Custom Script Snippets</CardTitle>
                    <CardDescription className="text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 text-xs mt-2">
                      Note: These snippets are rendered inline inside the page body, not injected into the actual &lt;head&gt; or end of &lt;body&gt;. Script tags are stripped by the sanitizer on save. Use the global layout settings for site-wide tracking pixels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField control={form.control} name="customHeadScripts" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Top-of-Page Snippet</FormLabel>
                        <FormControl><Textarea className="font-mono text-xs h-32 bg-gray-50" placeholder="<!-- inline snippet rendered near top of page content -->" {...field} /></FormControl>
                        <FormDescription>Rendered at the top of page content. Script tags will be stripped on save.</FormDescription>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="customFooterScripts" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bottom-of-Page Snippet</FormLabel>
                        <FormControl><Textarea className="font-mono text-xs h-32 bg-gray-50" placeholder="<!-- inline snippet rendered near bottom of page content -->" {...field} /></FormControl>
                        <FormDescription>Rendered at the bottom of page content. Script tags will be stripped on save.</FormDescription>
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>

          <div className="lg:col-span-1 space-y-6">
             {/* General Sidebar Config */}
             <Card>
               <CardHeader className="bg-muted/50 border-b p-4"><CardTitle className="text-lg">Publishing</CardTitle></CardHeader>
               <CardContent className="p-4 space-y-6">
                 <FormField control={form.control} name="status" render={({ field }) => (
                   <FormItem>
                     <FormLabel>Page Status</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISHED">Published</SelectItem>
                        </SelectContent>
                     </Select>
                   </FormItem>
                 )} />
               </CardContent>
             </Card>

             <Card>
               <CardHeader className="bg-muted/50 border-b p-4"><CardTitle className="text-lg">Featured Media</CardTitle></CardHeader>
               <CardContent className="p-4">
                  <FormField control={form.control} name="featuredImage" render={({ field }) => (
                    <FormItem>
                       <FormControl>
                          {field.value ? (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                              <Image src={field.value} alt="Featured" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
                              <Button variant="destructive" size="sm" type="button" className="absolute top-2 right-2 h-7 px-2" onClick={() => field.onChange("")}>Remove</Button>
                            </div>
                          ) : (
                            <div className="border border-dashed p-8 rounded-lg flex flex-col items-center justify-center bg-gray-50">
                               <ImageIcon className="w-8 h-8 text-gray-400 mb-2"/>
                               <span className="text-xs text-gray-500 text-center">No image selected</span>
                            </div>
                          )}
                       </FormControl>
                       <div className="mt-4">
                         <Input type="file" accept="image/*" className="hidden" id="f-img-upload" onChange={(e) => handleImageUpload(e, "featuredImage")} disabled={isUploading}/>
                         <Button type="button" variant="outline" className="w-full text-xs font-semibold uppercase tracking-wider" onClick={() => document.getElementById("f-img-upload")?.click()} disabled={isUploading}>
                           {isUploading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Select Media"}
                         </Button>
                       </div>
                    </FormItem>
                  )} />
               </CardContent>
             </Card>
          </div>

        </div>
      </form>
    </Form>
  );
}
