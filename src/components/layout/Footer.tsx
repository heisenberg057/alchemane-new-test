"use client";

import { usePathname } from "next/navigation";
import { Footer as HomepageFooter } from "@/components/homepage/Footer";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages, auth pages, funnel LPs, and the Alchemane brand pages
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/lp") ||
    pathname.startsWith("/alchemane")
  ) {
    return null;
  }

  return <HomepageFooter />;
}
