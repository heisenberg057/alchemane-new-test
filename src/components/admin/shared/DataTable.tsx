import { useState } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  renderExpandedRow?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  emptyTitle = "No data found",
  emptyDescription = "There are no items to display here yet.",
  emptyAction,
  renderExpandedRow,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              {renderExpandedRow && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-[80%]" />
                  </TableCell>
                ))}
                {renderExpandedRow && (
                  <TableCell>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              {renderExpandedRow && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const isExpanded = !!expandedRows[item.id];
              return (
                <React.Fragment key={item.id}>
                  <TableRow 
                    className={`hover:bg-muted/50 ${renderExpandedRow ? "cursor-pointer" : ""}`}
                    onClick={() => renderExpandedRow && toggleRow(item.id)}
                  >
                    {columns.map((col, i) => (
                      <TableCell key={i} className={col.className}>
                        {col.cell
                          ? col.cell(item)
                          : col.accessorKey
                          ? (item[col.accessorKey] as React.ReactNode)
                          : null}
                      </TableCell>
                    ))}
                    {renderExpandedRow && (
                      <TableCell>
                        <div className={`p-2 rounded-md inline-flex items-center justify-center transition-colors ${isExpanded ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                  {renderExpandedRow && isExpanded && (
                    <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                      <TableCell colSpan={columns.length + 1} className="p-0 border-b">
                        <div className="p-6 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          {renderExpandedRow(item)}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pagination && onPageChange && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {pagination.page} of {pagination.pages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
