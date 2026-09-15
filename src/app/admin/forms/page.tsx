"use client";

import { useGetSubmissions, useDeleteSubmission, useUpdateSubmission } from "@/lib/hooks/useForms";
import { DataTable } from "@/components/admin/shared/DataTable";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
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
import { Search, Trash, Download, Info } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FormsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, isError, error } = useGetSubmissions({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  const deleteMutation = useDeleteSubmission();
  const updateMutation = useUpdateSubmission();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleExportCSV = () => {
    if (!data?.submissions || data.submissions.length === 0) return;
    
    const headers = ["Status", "Type", "Name", "Email", "Phone", "Subject", "Date", "Campaign Source"];
    const csvContent = [
      headers.join(","),
      ...data.submissions.map((sub: any) => [
        sub.status || "NEW",
        sub.type || "-",
        `"${(sub.name || "").replace(/"/g, '""')}"`,
        `"${(sub.email || "").replace(/"/g, '""')}"`,
        `"${(sub.phone || "").replace(/"/g, '""')}"`,
        `"${(sub.subject || "").replace(/"/g, '""')}"`,
        format(new Date(sub.createdAt), "yyyy-MM-dd HH:mm"),
        `"${(sub.utmCampaign || sub.campaignSource || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `submissions_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: "SNO",
      className: "w-[80px]",
      cell: (sub: any) => <span className="text-muted-foreground">{sub.id}</span>
    },
    {
      header: "NAME",
      cell: (sub: any) => {
        return <span className="font-medium text-slate-800">{sub.name || "Unknown"}</span>;
      },
    },
    {
      header: "EMAIL",
      cell: (sub: any) => {
        return <span className="text-slate-600">{sub.email || "-"}</span>;
      },
    },
    {
      header: "PHONE",
      cell: (sub: any) => {
        return <span className="text-slate-600">{sub.phone || "-"}</span>;
      },
    },
    {
      header: "IP ADDRESS",
      cell: (sub: any) => {
        return <span className="text-slate-600">{sub.ipAddress || "-"}</span>;
      },
    },
    {
      header: "DATE",
      cell: (sub: any) => (
        <div className="flex flex-col text-sm text-slate-600">
          <span>{format(new Date(sub.createdAt), "dd MMM yyyy")}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(sub.createdAt), "hh:mm a")}</span>
        </div>
      ),
    }
  ];

  const renderExpandedRow = (sub: any) => {
    if (!sub) return null;
    
    // Auto-mark as read natively upon expansion if you wanted, but for safety we'll leave it to explicit actions.

    return (
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 bg-slate-50 border-b px-4 py-3">
          <Info className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold text-sm text-slate-700">Additional Details</h3>
          <div className="ml-auto">
            <StatusBadge status={sub.status} />
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-sm">
            {/* Row 1 */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">Name:</span>
              <span className="font-medium text-base truncate">{sub.name || '-'}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">Subject:</span>
              <span className="font-medium truncate" title={sub.subject}>{sub.subject || '-'}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">Source:</span>
              <span className="font-medium truncate">{sub.utmSource || sub.sourceUrl || '-'}</span>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">Campaignname:</span>
              <span className="font-medium truncate" title={sub.campaignName || sub.utmCampaign}>{sub.campaignName || sub.utmCampaign || '-'}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">Adsetname:</span>
              <span className="font-medium truncate" title={sub.adSetName}>{sub.adSetName || '-'}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">Adname:</span>
              <span className="font-medium truncate" title={sub.adName || sub.utmTerm}>{sub.adName || sub.utmTerm || '-'}</span>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">CampaignSource:</span>
              <span className="font-medium truncate">{sub.campaignSource || '-'}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">Placement:</span>
              <span className="font-medium truncate">{sub.placement || '-'}</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">Session Mode:</span>
              <span className="font-medium truncate">{sub.type || '-'}</span>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800">
              <span className="text-slate-500">FB / GCLID:</span>
              <span className="font-medium truncate" title={`${sub.fbclid || '-'} / ${sub.gclid || '-'}`}>
                {sub.fbclid || sub.gclid || '-'}
              </span>
            </div>
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 text-slate-800 lg:col-span-2">
              <span className="text-slate-500">Source Url:</span>
              <a href={sub.sourceUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline truncate">
                {sub.sourceUrl || '-'}
              </a>
            </div>
            
            {sub.message && (
              <div className="col-span-full mt-2 bg-slate-50 p-4 rounded-lg border">
                <p className="text-slate-500 mb-1 text-xs uppercase tracking-wide">User Message</p>
                <div className="text-sm text-slate-800 whitespace-pre-wrap">{sub.message}</div>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex items-center justify-end border-t pt-4 gap-3">
             <Button 
               variant={sub.status === 'COMPLETED' ? 'outline' : 'default'}
               onClick={() => updateMutation.mutate({ id: sub.id, status: 'COMPLETED' })}
               disabled={sub.status === 'COMPLETED'}
             >
               {sub.status === 'COMPLETED' ? 'Marked as Complete' : 'Mark as Complete'}
             </Button>
             <Button 
               variant="destructive" 
               onClick={() => setDeleteId(sub.id)}
             >
               <Trash className="w-4 h-4 mr-2" /> Delete
             </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Form Submissions"
        subtitle="View and manage customer inquiries."
        actions={
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, phone..."
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
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="READ">Read</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-semibold">Failed to fetch submissions</p>
            <p className="text-sm opacity-90">{error instanceof Error ? error.message : "Network error"}</p>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.submissions || []}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 10,
          total: data?.meta?.total || 0,
          pages: data?.meta?.pages || 1,
        }}
        onPageChange={setPage}
        emptyTitle="No submissions found"
        emptyDescription="When customers fill out forms, they will appear here."
        renderExpandedRow={renderExpandedRow}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Submission"
        description="Are you sure you want to delete this submission record? This cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
