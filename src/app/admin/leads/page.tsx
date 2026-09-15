"use client";

import { useLeads, useUpdateLeadStatus } from "@/lib/hooks/useLeads";
import { DataTable } from "@/components/admin/shared/DataTable";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { StatsCard } from "@/components/admin/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Users, TrendingUp, Calendar, Download, Target, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LEAD_STATUSES = [
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const { data, isLoading } = useLeads({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 20,
  });

  const updateStatusMutation = useUpdateLeadStatus();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    await updateStatusMutation.mutateAsync({ id, status: newStatus });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const columns = [
    {
      header: "Score",
      cell: (lead: any) => {
        let color = "bg-slate-100 text-slate-800";
        if (lead.score >= 70) color = "bg-green-100 text-green-800";
        else if (lead.score >= 40) color = "bg-yellow-100 text-yellow-800";
        
        return (
          <Badge variant="outline" className={color}>
            {lead.score}
          </Badge>
        );
      }
    },
    {
      header: "Name",
      cell: (lead: any) => {
        const name = lead.user?.name || (lead.metaData as any)?.name || "Unknown";
        return <span className="font-medium">{name}</span>;
      },
    },
    {
      header: "Email",
      cell: (lead: any) => {
        const email = lead.user?.email || (lead.metaData as any)?.email || "-";
        return <span className="text-muted-foreground">{email}</span>;
      },
    },
    {
      header: "Status",
      cell: (lead: any) => (
        <Badge variant="outline" className="capitalize">
          {lead.status?.toLowerCase().replace('_', ' ') || 'New'}
        </Badge>
      ),
    },
    {
      header: "Last Active",
      cell: (lead: any) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(lead.updatedAt || lead.createdAt), "MMM d, HH:mm")}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "w-[100px]",
      cell: (lead: any) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
          View Details
        </Button>
      ),
    },
  ];

  const getLeadDetails = (lead: any) => {
    if (!lead) return null;
    const meta = lead.metaData || {};
    const name = lead.user?.name || meta.name || "Unknown";
    const email = lead.user?.email || meta.email || "-";
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <Badge className={lead.score >= 70 ? "bg-green-600" : (lead.score >= 40 ? "bg-yellow-600" : "bg-blue-600")}>
              Score: {lead.score}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Phone</p>
              <p>{meta.phone || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Source</p>
              <p>{meta.source || meta.utmSource || "Direct"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Campaign</p>
              <p>{meta.campaignName || meta.utmCampaign || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Ad Name</p>
              <p>{meta.adName || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Ad Set</p>
              <p>{meta.adSetName || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Placement</p>
              <p>{meta.placement || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Location</p>
              <p>{meta.location || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">First Seen</p>
              <p>{format(new Date(lead.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Status</h4>
          <Select 
            value={lead.status || "NEW"} 
            onValueChange={(val) => handleStatusUpdate(lead.id, val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((statusOption) => (
                <SelectItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Score Factors</h4>
          <div className="space-y-2">
            {lead.scoreBreakdown?.map((factor: any, i: number) => (
              <div key={i} className="flex justify-between text-sm p-2 bg-white border rounded">
                <span>{factor.reason}</span>
                <span className={factor.points > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {factor.points > 0 ? "+" : ""}{factor.points}
                </span>
              </div>
            ))}
            {(!lead.scoreBreakdown || lead.scoreBreakdown.length === 0) && (
              <p className="text-sm text-muted-foreground">No detailed breakdown available.</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Activity Timeline</h4>
          <div className="border-l-2 border-slate-200 ml-2 space-y-4 pl-4 py-2">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-300"></div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-xs text-muted-foreground">{format(new Date(lead.updatedAt), "PPpp")}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-300"></div>
              <p className="text-sm font-medium">Lead Created</p>
              <p className="text-xs text-muted-foreground">{format(new Date(lead.createdAt), "PPpp")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const leadsList = data?.leads || [];
  const meta = data?.meta || { total: 0, pages: 1 };
  const totalLeads = Number(meta.total ?? 0);
  const totalPages = Number(meta.pages ?? 1);
  
  // Calculate simple stats from current page data (ideally should come from API stats endpoint)
  const highPriorityCount = leadsList.filter((l: any) => l.score >= 70).length;
  const newLeadsCount = leadsList.filter((l: any) => l.status === 'NEW').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Scoring"
        subtitle="Track and manage potential high-value customers."
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
        />
        <StatsCard
          title="High Priority"
          value={highPriorityCount}
          icon={Target}
        />
        <StatsCard
          title="New Leads"
          value={newLeadsCount}
          icon={MessageSquare}
        />
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {LEAD_STATUSES.map((statusOption) => (
              <SelectItem key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      </div>

      <DataTable
        columns={columns}
        data={leadsList}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 20,
          total: totalLeads,
          pages: totalPages,
        }}
        onPageChange={setPage}
        emptyTitle="No leads found"
        emptyDescription="Leads will appear here as users interact with your site."
      />

      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>Lead Profile</SheetTitle>
            <SheetDescription>
              Detailed score analysis and activity log.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            {getLeadDetails(selectedLead)}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
