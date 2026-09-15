import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed bg-muted/20 p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FolderOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action}
    </div>
  );
}
