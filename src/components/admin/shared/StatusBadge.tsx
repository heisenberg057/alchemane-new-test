import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  
  const normalizedStatus = status?.toUpperCase() || "UNKNOWN";

  if (["PUBLISHED", "ACTIVE", "IN_STOCK", "READ", "COMPLETED"].includes(normalizedStatus)) {
    variant = "default"; // Green/Primary
  } else if (["DRAFT", "PENDING", "NEW", "ON_HOLD"].includes(normalizedStatus)) {
    variant = "secondary"; // Yellow/Gray
  } else if (["REJECTED", "OUT_OF_STOCK", "DELETED", "ARCHIVED", "CANCELLED"].includes(normalizedStatus)) {
    variant = "destructive"; // Red
  }

  // Map to friendly text if needed, or just use status
  const label = status?.replace(/_/g, " ") || "Unknown";

  return (
    <Badge variant={variant} className="capitalize">
      {label.toLowerCase()}
    </Badge>
  );
}
