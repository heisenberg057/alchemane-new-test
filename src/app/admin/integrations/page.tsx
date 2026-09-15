"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Play,
  Activity,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { api } from "@/lib/api/endpoints";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers: Record<string, string> | null;
  payload: Record<string, unknown> | null;
  isActive: boolean;
  method: string;
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  successCount: number;
  failureCount: number;
}

interface WebhookLog {
  id: string;
  event: string;
  status: string;
  statusCode: number | null;
  attempts: number;
  duration: number | null;
  errorMessage: string | null;
  payload: Record<string, unknown> | null;
  response: { bodySnippet?: string } | null;
  createdAt: string;
}

interface Preset {
  name: string;
  method: string;
  events: string[];
  headers: Record<string, string>;
  payload: Record<string, unknown> | null;
  instructions: string;
}

interface EventCatalogItem {
  name: string;
  description: string;
  samplePayload: Record<string, unknown>;
}

// ─── Secret masking helpers ───────────────────────────────────────────────────

const MASK = "••••••••••••••••";

/**
 * Returns headers JSON for display, masking values that look like secrets.
 * A "secret" is any header value longer than 8 chars that isn't a well-known
 * non-sensitive value (Content-Type, Accept, etc.).
 */
function maskHeadersForDisplay(headers: Record<string, string>): string {
  const SAFE_KEYS = new Set(["content-type", "accept", "user-agent"]);
  const masked: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    if (SAFE_KEYS.has(k.toLowerCase()) || v.length <= 8) {
      masked[k] = v;
    } else {
      masked[k] = MASK;
    }
  }
  return JSON.stringify(masked, null, 2);
}

/**
 * Returns headers JSON for display when editing an existing webhook.
 * If any value is the mask sentinel, we know the user hasn't changed it,
 * so we keep the real value from the saved webhook on submit.
 */
function headersContainMask(headersJson: string): boolean {
  return headersJson.includes(MASK);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [presets, setPresets] = useState<Record<string, Preset>>({});
  const [availableEvents, setAvailableEvents] = useState<EventCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingActiveId, setUpdatingActiveId] = useState<string | null>(null);
  const [retryingLogId, setRetryingLogId] = useState<string | null>(null);

  // Create/Edit dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    events: [] as string[],
    headers: "",
    payload: "",
    isActive: true,
    method: "POST",
    retryAttempts: 3,
    retryDelay: 5000,
    timeout: 30000,
  });

  // Tracks whether the header field is showing masked values (edit mode for existing webhook)
  const [headersMasked, setHeadersMasked] = useState(false);
  const [showHeadersRaw, setShowHeadersRaw] = useState(false);

  // Delete confirm
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Logs dialog
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [logsWebhookName, setLogsWebhookName] = useState("");
  const [selectedWebhookLogs, setSelectedWebhookLogs] = useState<WebhookLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadError(null);
    try {
      const [webhooksData, presetsData, eventsData] = await Promise.all([
        api.getWebhooks(),
        api.getIntegrationPresets(),
        api.getWebhookEvents(),
      ]);
      setWebhooks((webhooksData.webhooks ?? []) as Webhook[]);
      setPresets(presetsData as Record<string, Preset>);
      setAvailableEvents((eventsData as EventCatalogItem[]) ?? []);
    } catch {
      setWebhooks([]);
      setPresets({});
      setAvailableEvents([]);
      setLoadError("Failed to load integrations data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  // ── Extracts a user-readable error message from the API error ──────────────
  function extractErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === "object") {
      const e = error as Record<string, unknown>;
      if (typeof e.message === "string" && e.message) return e.message;
      if (typeof e.error === "string" && e.error) return e.error;
    }
    if (error instanceof Error && error.message) return error.message;
    return fallback;
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Validation error", description: "Name is required.", variant: "destructive" });
      return;
    }
    if (!formData.url.trim()) {
      toast({ title: "Validation error", description: "URL is required.", variant: "destructive" });
      return;
    }
    if (formData.events.length === 0) {
      toast({ title: "Validation error", description: "Select at least one event.", variant: "destructive" });
      return;
    }

    // Parse headers JSON if provided
    let parsedHeaders: Record<string, string> | undefined;
    if (formData.headers.trim()) {
      if (headersMasked && !showHeadersRaw) {
        // Admin did not click "Edit secrets" — headers are displaying masked values.
        // Send them as-is so the backend's mergeHeaders() can restore real values
        // for any masked key. Do NOT try to use editingWebhook.headers here because
        // that value came from the API and is already masked.
        try {
          parsedHeaders = JSON.parse(formData.headers);
        } catch {
          toast({ title: "Invalid JSON", description: "Custom Headers must be valid JSON.", variant: "destructive" });
          return;
        }
      } else {
        try {
          parsedHeaders = JSON.parse(formData.headers);
        } catch {
          toast({ title: "Invalid JSON", description: "Custom Headers must be valid JSON.", variant: "destructive" });
          return;
        }
      }
    }

    // Parse payload JSON if provided
    let parsedPayload: Record<string, unknown> | undefined;
    if (formData.payload.trim()) {
      try {
        parsedPayload = JSON.parse(formData.payload);
      } catch {
        toast({ title: "Invalid JSON", description: "Custom Payload Template must be valid JSON.", variant: "destructive" });
        return;
      }
    }

    // Reject placeholder tokens that were never replaced by the admin
    const headersStr = JSON.stringify(parsedHeaders ?? {});
    if (/YOUR_[A-Z_]+/.test(headersStr)) {
      toast({ title: "Validation error", description: "Replace all placeholder values (YOUR_...) in headers before saving.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const body = {
        name: formData.name,
        url: formData.url,
        events: formData.events,
        isActive: formData.isActive,
        headers: parsedHeaders,
        payload: parsedPayload,
        method: formData.method,
        retryAttempts: formData.retryAttempts,
        retryDelay: formData.retryDelay,
        timeout: formData.timeout,
      };

      if (editingWebhook) {
        await api.updateWebhook(editingWebhook.id, body);
        toast({ title: "Saved", description: "Webhook updated." });
      } else {
        await api.createWebhook(body);
        toast({ title: "Created", description: "Webhook created." });
      }

      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Save failed",
        description: extractErrorMessage(error, "Could not save webhook."),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.deleteWebhook(id);
      toast({ title: "Deleted", description: "Webhook deleted." });
      fetchData();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: extractErrorMessage(error, "Could not delete webhook."),
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const res = await api.testWebhook(id);
      if (res.ok) {
        toast({ title: "Test delivered", description: `HTTP ${res.statusCode ?? ""}` });
      } else {
        toast({
          title: "Test failed",
          description: res.error || `HTTP ${res.statusCode ?? "error"}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Test error",
        description: extractErrorMessage(error, "Could not reach webhook URL."),
        variant: "destructive",
      });
    } finally {
      setTestingId(null);
    }
  };

  const handleToggleActive = async (id: string, checked: boolean) => {
    setUpdatingActiveId(id);
    try {
      await api.updateWebhook(id, { isActive: checked });
      toast({ title: checked ? "Activated" : "Deactivated" });
      fetchData();
    } catch (error) {
      toast({
        title: "Update failed",
        description: extractErrorMessage(error, "Could not update status."),
        variant: "destructive",
      });
    } finally {
      setUpdatingActiveId(null);
    }
  };

  const handleViewLogs = async (webhook: Webhook) => {
    try {
      const data = await api.getWebhookLogs(webhook.id);
      setSelectedWebhookLogs((data.logs ?? []) as WebhookLog[]);
      setLogsWebhookName(webhook.name);
      setExpandedLogId(null);
      setIsLogsOpen(true);
    } catch (error) {
      toast({
        title: "Failed to load logs",
        description: extractErrorMessage(error, "Could not fetch delivery logs."),
        variant: "destructive",
      });
    }
  };

  const handleRetryLog = async (logId: string) => {
    setRetryingLogId(logId);
    try {
      await api.retryWebhookLog(logId);
      toast({ title: "Retry initiated", description: "Delivery will be retried in the background." });
    } catch (error) {
      toast({
        title: "Retry failed",
        description: extractErrorMessage(error, "Could not retry delivery."),
        variant: "destructive",
      });
    } finally {
      setRetryingLogId(null);
    }
  };

  const loadPreset = (key: string) => {
    const preset = presets[key];
    if (!preset) return;
    setEditingWebhook(null);
    setHeadersMasked(false);
    setShowHeadersRaw(false);
    setShowAdvanced(false);
    setFormData({
      name: preset.name,
      url: "",
      events: preset.events,
      headers: preset.headers && Object.keys(preset.headers).length > 0
        ? JSON.stringify(preset.headers, null, 2)
        : "",
      payload: preset.payload ? JSON.stringify(preset.payload, null, 2) : "",
      isActive: true,
      method: preset.method ?? "POST",
      retryAttempts: 3,
      retryDelay: 5000,
      timeout: 30000,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingWebhook(null);
    setHeadersMasked(false);
    setShowHeadersRaw(false);
    setShowAdvanced(false);
    setFormData({ name: "", url: "", events: [], headers: "", payload: "", isActive: true, method: "POST", retryAttempts: 3, retryDelay: 5000, timeout: 30000 });
    setIsDialogOpen(true);
  };

  const openEditDialog = (webhook: Webhook) => {
    setEditingWebhook(webhook);
    const eventsArr = Array.isArray(webhook.events)
      ? webhook.events.map(String)
      : typeof webhook.events === "string"
        ? [webhook.events]
        : [];

    const hasSavedHeaders = webhook.headers && Object.keys(webhook.headers).length > 0;
    const maskedDisplay = hasSavedHeaders ? maskHeadersForDisplay(webhook.headers!) : "";

    setHeadersMasked(hasSavedHeaders ? true : false);
    setShowHeadersRaw(false);
    setShowAdvanced(false);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: eventsArr,
      headers: maskedDisplay,
      payload: webhook.payload ? JSON.stringify(webhook.payload, null, 2) : "",
      isActive: webhook.isActive ?? true,
      method: webhook.method ?? "POST",
      retryAttempts: webhook.retryAttempts ?? 3,
      retryDelay: webhook.retryDelay ?? 5000,
      timeout: webhook.timeout ?? 30000,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Integrations & Webhooks</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Webhook
        </Button>
      </div>

      {loadError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {loadError}
        </div>
      )}

      {/* ── Integration Presets ─────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Quick Setup Presets
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(presets).map((key) => {
            const preset = presets[key];
            return (
              <Card
                key={key}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => loadPreset(key)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">{preset.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-3">
                    {preset.instructions}
                  </p>
                  <p className="mt-2 text-xs font-medium text-primary">Click to configure →</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Webhooks Table ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Webhooks</CardTitle>
          <CardDescription>
            Webhooks are called automatically when a form is submitted on the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => {
                  const rowBusy =
                    testingId === webhook.id ||
                    deletingId === webhook.id ||
                    updatingActiveId === webhook.id;
                  return (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">{webhook.name}</TableCell>
                      <TableCell className="max-w-[220px] truncate text-muted-foreground text-xs">
                        {webhook.url}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(webhook.events) ? webhook.events : []).map((e: string) => (
                            <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={Boolean(webhook.isActive)}
                          disabled={rowBusy}
                          onCheckedChange={(checked) => handleToggleActive(webhook.id, checked)}
                          aria-label={webhook.isActive ? "Deactivate" : "Activate"}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={rowBusy}
                            onClick={() => handleTest(webhook.id)}
                            title="Send test delivery"
                          >
                            {testingId === webhook.id
                              ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              : <Play className="h-4 w-4 text-blue-500" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={rowBusy}
                            onClick={() => handleViewLogs(webhook)}
                            title="View delivery logs"
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={rowBusy}
                            onClick={() => openEditDialog(webhook)}
                            title="Edit webhook"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={rowBusy}
                            onClick={() => setConfirmDeleteId(webhook.id)}
                            title="Delete webhook"
                          >
                            {deletingId === webhook.id
                              ? <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                              : <Trash2 className="h-4 w-4 text-red-500" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {webhooks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No webhooks configured yet. Use a preset above or click "Add Webhook".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Create / Edit Dialog ────────────────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingWebhook ? "Edit Webhook" : "Create Webhook"}</DialogTitle>
            <DialogDescription>Configure where events should be sent.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="webhook-active">Active</Label>
                <p className="text-sm text-muted-foreground">
                  When off, this webhook will not receive any deliveries.
                </p>
              </div>
              <Switch
                id="webhook-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="wh-name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="wh-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Pabbly Form Handler"
              />
            </div>

            {/* URL */}
            <div className="grid gap-2">
              <Label htmlFor="wh-url">Webhook URL <span className="text-destructive">*</span></Label>
              <Input
                id="wh-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="Paste your Pabbly or n8n webhook URL here"
              />
            </div>

            {/* Events */}
            <div className="grid gap-2">
              <Label>Events to trigger on <span className="text-destructive">*</span></Label>
              <div className="border rounded-md p-4 space-y-2">
                {availableEvents.map((event) => (
                  <div key={event.name} className="flex items-start space-x-3">
                    <Checkbox
                      id={`ev-${event.name}`}
                      checked={formData.events.includes(event.name)}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          events: checked
                            ? [...formData.events, event.name]
                            : formData.events.filter((e) => e !== event.name),
                        });
                      }}
                    />
                    <div>
                      <Label htmlFor={`ev-${event.name}`} className="cursor-pointer font-medium text-sm">
                        {event.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Headers */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="wh-headers">
                  Custom Headers <span className="text-xs font-normal text-muted-foreground">(JSON, optional)</span>
                </Label>
                {headersMasked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-0 px-1 text-xs"
                    onClick={() => setShowHeadersRaw(!showHeadersRaw)}
                  >
                    {showHeadersRaw ? (
                      <><EyeOff className="h-3 w-3 mr-1" />Hide</>
                    ) : (
                      <><Eye className="h-3 w-3 mr-1" />Edit secrets</>
                    )}
                  </Button>
                )}
              </div>
              {headersMasked && !showHeadersRaw ? (
                <div className="rounded-md border bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
                  {formData.headers}
                  <p className="mt-2 text-xs not-mono text-muted-foreground/70 font-sans">
                    Secret values are masked. Click "Edit secrets" to change them.
                  </p>
                </div>
              ) : (
                <Textarea
                  id="wh-headers"
                  value={formData.headers}
                  onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                  placeholder={'{ "Authorization": "Bearer YOUR_API_KEY" }'}
                  className="font-mono text-xs min-h-[80px]"
                />
              )}
            </div>

            {/* Custom Payload Template */}
            <div className="grid gap-2">
              <Label htmlFor="wh-payload">
                Custom Payload Template <span className="text-xs font-normal text-muted-foreground">(JSON, optional — leave blank to send all form fields)</span>
              </Label>
              <Textarea
                id="wh-payload"
                value={formData.payload}
                onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                placeholder={'{ "email": "{{email}}", "name": "{{name}}" }'}
                className="font-mono text-xs min-h-[80px]"
              />
            </div>

            {/* Advanced Delivery Settings */}
            <div className="border rounded-md">
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <span>Advanced delivery settings</span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showAdvanced && (
                <div className="p-3 border-t grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="wh-method">HTTP Method</Label>
                    <select
                      id="wh-method"
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="wh-retry">Max retries</Label>
                      <Input
                        id="wh-retry"
                        type="number"
                        min={1}
                        max={10}
                        value={formData.retryAttempts}
                        onChange={(e) => setFormData({ ...formData, retryAttempts: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">1–10</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="wh-delay">Retry delay (ms)</Label>
                      <Input
                        id="wh-delay"
                        type="number"
                        min={100}
                        value={formData.retryDelay}
                        onChange={(e) => setFormData({ ...formData, retryDelay: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Default: 5000</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="wh-timeout">Timeout (ms)</Label>
                      <Input
                        id="wh-timeout"
                        type="number"
                        min={1000}
                        max={120000}
                        value={formData.timeout}
                        onChange={(e) => setFormData({ ...formData, timeout: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Max: 120000</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ────────────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => { if (!open) setConfirmDeleteId(null); }}
        title="Delete webhook?"
        description="This will permanently delete the webhook and all its delivery logs. This cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={!!deletingId}
        onConfirm={() => { if (confirmDeleteId) return handleDelete(confirmDeleteId); }}
      />

      {/* ── Logs Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Logs — {logsWebhookName}</DialogTitle>
            <DialogDescription>
              Most recent deliveries. Click a row to see the full payload and response.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedWebhookLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow
                      key={log.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                    >
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{log.event}</Badge>
                      </TableCell>
                      <TableCell>
                        {log.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : log.status === "pending" || log.status === "retrying" ? (
                          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{log.statusCode ?? "—"}</TableCell>
                      <TableCell className="text-xs">{log.duration != null ? `${log.duration}ms` : "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                        {log.errorMessage ?? "OK"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {log.status === "failed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); handleRetryLog(log.id); }}
                              disabled={retryingLogId === log.id}
                              title="Retry delivery"
                            >
                              {retryingLogId === log.id
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : <RefreshCw className="h-3 w-3" />}
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setExpandedLogId(expandedLogId === log.id ? null : log.id); }}>
                            {expandedLogId === log.id
                              ? <ChevronUp className="h-3 w-3" />
                              : <ChevronDown className="h-3 w-3" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedLogId === log.id && (
                      <TableRow key={`${log.id}-detail`}>
                        <TableCell colSpan={7} className="bg-muted/30 p-4">
                          <div className="space-y-3">
                            {log.payload && (
                              <div>
                                <p className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wide">
                                  Payload sent
                                </p>
                                <pre className="text-xs bg-background rounded border p-3 overflow-x-auto max-h-48">
                                  {JSON.stringify(log.payload, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.response?.bodySnippet && (
                              <div>
                                <p className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wide">
                                  Response received
                                </p>
                                <pre className="text-xs bg-background rounded border p-3 overflow-x-auto max-h-32">
                                  {log.response.bodySnippet}
                                </pre>
                              </div>
                            )}
                            {log.errorMessage && (
                              <div>
                                <p className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wide">
                                  Error
                                </p>
                                <p className="text-xs text-destructive">{log.errorMessage}</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                {selectedWebhookLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                      No delivery logs yet. Use the test button to send a sample delivery.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
