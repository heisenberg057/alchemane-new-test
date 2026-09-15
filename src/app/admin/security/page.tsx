"use client";

import { useSecurityLogs, useSecurityStats, useBlockedIPs, useBlockIP, useUnblockIP } from "@/lib/hooks/useSecurity";
import { DataTable } from "@/components/admin/shared/DataTable";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { StatsCard } from "@/components/admin/shared/StatsCard";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldAlert,
  ShieldCheck,
  Ban,
  AlertTriangle,
  Activity,
  Search,
  RefreshCw,
  Unlock,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function SecurityPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [severity, setSeverity] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  
  // Block IP Form State
  const [blockIP, setBlockIP] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockDuration, setBlockDuration] = useState("60"); // minutes

  const { data: logsData, isLoading: logsLoading, refetch: refetchLogs, dataUpdatedAt } = useSecurityLogs({
    search: debouncedSearch,
    severity: severity === "ALL" ? undefined : severity,
    page,
    limit: 20,
  });

  const { data: statsData } = useSecurityStats();
  const { data: blockedIPsData, refetch: refetchBlocked } = useBlockedIPs();
  
  const blockMutation = useBlockIP();
  const unblockMutation = useUnblockIP();

  const handleBlockSubmit = async () => {
    if (!blockIP || !blockReason) {
      toast({ title: "Validation Error", description: "IP and Reason are required", variant: "destructive" });
      return;
    }
    
    try {
      await blockMutation.mutateAsync({
        ip: blockIP,
        reason: blockReason,
        duration: parseInt(blockDuration),
      });
      toast({ title: "IP Blocked", description: `${blockIP} has been blocked.` });
      setBlockDialogOpen(false);
      setBlockIP("");
      setBlockReason("");
    } catch (err) {
      toast({ title: "Error", description: "Failed to block IP", variant: "destructive" });
    }
  };

  const handleUnblock = async (ip: string) => {
    try {
      await unblockMutation.mutateAsync({ ip });
      toast({ title: "IP Unblocked", description: `${ip} access restored.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to unblock IP", variant: "destructive" });
    }
  };

  const columns = [
    {
      header: "Timestamp",
      cell: (log: any) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
        </span>
      ),
    },
    {
      header: "Event Type",
      cell: (log: any) => (
        <span className="font-mono text-xs font-medium">{log.eventType}</span>
      ),
    },
    {
      header: "Severity",
      cell: (log: any) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        if (log.severity === 'CRITICAL' || log.severity === 'HIGH') variant = 'destructive';
        else if (log.severity === 'WARNING') variant = 'secondary';
        
        return (
          <Badge variant={variant} className="text-[10px]">
            {log.severity}
          </Badge>
        );
      }
    },
    {
      header: "IP Address",
      cell: (log: any) => (
        <span className="font-mono text-xs">{log.ipAddress}</span>
      ),
    },
    {
      header: "Details",
      cell: (log: any) => (
        <span className="text-sm truncate max-w-[300px] block" title={log.description}>
          {log.description}
        </span>
      ),
    },
    {
      header: "User",
      cell: (log: any) => (
        <span className="text-xs text-muted-foreground">
          {log.user?.email || (log.userId ? `ID: ${log.userId}` : 'Anonymous')}
        </span>
      ),
    },
  ];

  const blockedColumns = [
    { header: "IP Address", accessorKey: "ip" as const, className: "font-mono" },
    { header: "Reason", accessorKey: "reason" as const },
    { 
      header: "Blocked At", 
      cell: (item: any) => format(new Date(item.createdAt), "MMM d, HH:mm") 
    },
    { 
      header: "Expires At", 
      cell: (item: any) => item.expiresAt ? format(new Date(item.expiresAt), "MMM d, HH:mm") : "Permanent" 
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <Button variant="ghost" size="sm" onClick={() => handleUnblock(item.ip)}>
          <Unlock className="mr-2 h-3 w-3" /> Unblock
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Security & Logs"
        subtitle="Monitor system activity and manage access control."
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
            Updated: {dataUpdatedAt ? format(new Date(dataUpdatedAt), "HH:mm:ss") : "Never"}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Failed Logins (24h)"
          value={statsData?.failedLogins || 0}
          icon={AlertTriangle}
          className="border-red-200 bg-red-50/30"
        />
        <StatsCard
          title="Rate Limit Hits"
          value={statsData?.rateLimitHits || 0}
          icon={Activity}
        />
        <StatsCard
          title="Active Sessions"
          value={statsData?.activeSessions || 0}
          icon={ShieldCheck}
          className="border-green-200 bg-green-50/30"
        />
        <StatsCard
          title="Blocked IPs"
          value={blockedIPsData?.length || 0}
          icon={Ban}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Security Logs</h2>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={logsData?.logs || []}
          isLoading={logsLoading}
          pagination={{
            page,
            limit: 20,
            total: logsData?.meta?.total || 0,
            pages: logsData?.meta?.pages || 1,
          }}
          onPageChange={setPage}
          emptyTitle="No logs found"
          emptyDescription="Security events will appear here in real-time."
        />
      </div>

      <div className="space-y-4 pt-8 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-red-600 flex items-center gap-2">
            <Ban className="h-5 w-5" /> Blocked IP Addresses
          </h2>
          <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Block IP
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block IP Address</DialogTitle>
                <DialogDescription>
                  Prevent an IP address from accessing the API.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input id="ip" value={blockIP} onChange={(e) => setBlockIP(e.target.value)} placeholder="192.168.1.1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input id="reason" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Suspicious activity" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={blockDuration} onValueChange={setBlockDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 Hour</SelectItem>
                      <SelectItem value="1440">24 Hours</SelectItem>
                      <SelectItem value="10080">7 Days</SelectItem>
                      <SelectItem value="525600">Permanent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleBlockSubmit} disabled={blockMutation.isPending}>Block IP</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={blockedColumns}
          data={blockedIPsData || []}
          isLoading={false} // Assume fast load or use query state
          emptyTitle="No blocked IPs"
          emptyDescription="There are no actively blocked IP addresses."
        />
      </div>
    </div>
  );
}
