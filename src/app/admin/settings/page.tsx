"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useGetSettings, useUpdateSettings, Settings } from "@/lib/hooks/useSettings";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().optional(),
  adminEmail: z.string().email("Invalid email address"),
  // Contact & Social
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  contactEmail: z.string().email("Invalid email").or(z.literal("")).optional(),
  socialFacebook: z.string().url("Must be a URL").or(z.literal("")).optional(),
  socialInstagram: z.string().url("Must be a URL").or(z.literal("")).optional(),
  socialYoutube: z.string().url("Must be a URL").or(z.literal("")).optional(),
  // AI
  ai_seo_model: z.string().min(1),
  // Site Behaviour
  formCities: z.string().optional(),
  maintenanceMode: z.boolean(),
  blogCommentsEnabled: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const SEO_CONTENT_MODELS = [
  { id: "gemini-flash", label: "Google Gemini 1.5 Flash" },
  { id: "grok-fast", label: "xAI Grok Fast" },
  { id: "deepseek", label: "DeepSeek V3" },
  { id: "qwen-max", label: "Qwen Max" },
];

const TRACKING_ENV_VARS = [
  { name: "NEXT_PUBLIC_GA_ID", label: "Google Analytics 4" },
  { name: "NEXT_PUBLIC_GTM_ID", label: "Google Tag Manager" },
  { name: "NEXT_PUBLIC_FB_PIXEL_ID", label: "Facebook Pixel" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading, isError } = useGetSettings();
  const updateSettingsMutation = useUpdateSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      adminEmail: "",
      phone: "",
      whatsapp: "",
      contactEmail: "",
      socialFacebook: "",
      socialInstagram: "",
      socialYoutube: "",
      ai_seo_model: "gemini-flash",
      formCities: "Mumbai,Delhi,Bangalore,Hyderabad,Other",
      maintenanceMode: false,
      blogCommentsEnabled: true,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName || "",
        siteDescription: settings.siteDescription || "",
        adminEmail: settings.adminEmail || "",
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        contactEmail: settings.contactEmail || "",
        socialFacebook: settings.socialFacebook || "",
        socialInstagram: settings.socialInstagram || "",
        socialYoutube: settings.socialYoutube || "",
        ai_seo_model: settings.ai_seo_model || "gemini-flash",
        formCities: settings.formCities || "Mumbai,Delhi,Bangalore,Hyderabad,Other",
        maintenanceMode: settings.maintenanceMode ?? false,
        blogCommentsEnabled: settings.blogCommentsEnabled ?? true,
      });
    }
  }, [settings, form]);

  const handleSubmit = async (values: SettingsFormValues) => {
    try {
      await updateSettingsMutation.mutateAsync(values as Settings);
      toast({ title: "Success", description: "Settings updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update settings", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">
            Could not load settings from the server. Saving is disabled until the page reloads successfully.
          </p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

        {/* ── Card 1: General ──────────────────────────────────────────── */}
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" {...form.register("siteName")} />
                {form.formState.errors.siteName && (
                  <p className="text-sm text-destructive">{form.formState.errors.siteName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Notification Email</Label>
                <Input id="adminEmail" {...form.register("adminEmail")} />
                {form.formState.errors.adminEmail && (
                  <p className="text-sm text-destructive">{form.formState.errors.adminEmail.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea id="siteDescription" {...form.register("siteDescription")} />
            </div>
          </CardContent>
        </Card>

        {/* ── Card 2: Contact & Social ─────────────────────────────────── */}
        <Card>
          <CardHeader><CardTitle>Contact &amp; Social</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...form.register("phone")} placeholder="9222666111" />
                <p className="text-xs text-muted-foreground">Shown in footer &amp; schema markup</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input id="whatsapp" {...form.register("whatsapp")} placeholder="9222666111" />
                <p className="text-xs text-muted-foreground">Used for WhatsApp chat links</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Public Contact Email</Label>
                <Input id="contactEmail" {...form.register("contactEmail")} placeholder="info@americanhairline.com" />
                {form.formState.errors.contactEmail && (
                  <p className="text-sm text-destructive">{form.formState.errors.contactEmail.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="socialFacebook">Facebook URL</Label>
                <Input id="socialFacebook" {...form.register("socialFacebook")} placeholder="https://facebook.com/yourpage" />
                {form.formState.errors.socialFacebook && (
                  <p className="text-sm text-destructive">{form.formState.errors.socialFacebook.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialInstagram">Instagram URL</Label>
                <Input id="socialInstagram" {...form.register("socialInstagram")} placeholder="https://instagram.com/yourhandle" />
                {form.formState.errors.socialInstagram && (
                  <p className="text-sm text-destructive">{form.formState.errors.socialInstagram.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialYoutube">YouTube URL</Label>
                <Input id="socialYoutube" {...form.register("socialYoutube")} placeholder="https://youtube.com/@yourchannel" />
                {form.formState.errors.socialYoutube && (
                  <p className="text-sm text-destructive">{form.formState.errors.socialYoutube.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Card 3: AI Configuration ─────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>AI Configuration</CardTitle>
              <Badge variant="default" className="bg-green-600 text-white text-xs">DB</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="ai_seo_model">SEO &amp; Content Optimization Model</Label>
            <Select
              onValueChange={(value) => form.setValue("ai_seo_model", value)}
              value={form.watch("ai_seo_model")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {SEO_CONTENT_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>{model.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Saved to database. The AI SEO engine reads this value at runtime.
            </p>
          </CardContent>
        </Card>

        {/* ── Card 4: Site Behaviour ───────────────────────────────────── */}
        <Card>
          <CardHeader><CardTitle>Site Behaviour</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="formCities">Contact Form Cities</Label>
              <Input id="formCities" {...form.register("formCities")} placeholder="Mumbai,Delhi,Bangalore,Hyderabad,Other" />
              <p className="text-xs text-muted-foreground">Comma-separated. Shown in the city dropdown on the homepage contact form.</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Redirect all visitors to a maintenance page</p>
              </div>
              <Switch
                checked={form.watch("maintenanceMode")}
                onCheckedChange={(v) => form.setValue("maintenanceMode", v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Blog Comments</p>
                <p className="text-xs text-muted-foreground">Allow visitors to leave comments on blog posts</p>
              </div>
              <Switch
                checked={form.watch("blogCommentsEnabled")}
                onCheckedChange={(v) => form.setValue("blogCommentsEnabled", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Card 5: Tracking (read-only) ─────────────────────────────── */}
        <Card>
          <CardHeader><CardTitle>Analytics &amp; Tracking</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="divide-y rounded-md border">
              {TRACKING_ENV_VARS.map(({ name, label }) => (
                <div key={name} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground font-mono">{name}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Not set</Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Managed via environment variable — contact your developer to change.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={updateSettingsMutation.isPending || isError}>
            {updateSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
