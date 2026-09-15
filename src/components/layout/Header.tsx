"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/homepage/Navbar";

export function Header() {
  const pathname = usePathname();

  // Hide header on admin pages, auth pages, funnel LPs, and the Alchemane brand pages
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/lp") ||
    pathname.startsWith("/alchemane")
  ) {
    return null;
  }

  return <Navbar />;
}
