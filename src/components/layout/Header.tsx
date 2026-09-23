"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/homepage/Navbar";

export function Header() {
  const pathname = usePathname();

  // Hide header on admin pages, auth pages, funnel LPs, and the Alchemane brand pages.
  // The Alchemane pages are also deployed as an isolated build with basePath: '/lp',
  // where Next strips that prefix from usePathname() — so the bare route names are
  // checked too, for that build specifically.
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/lp") ||
    pathname.startsWith("/alchemane") ||
    pathname.startsWith("/permanent-extensions") ||
    pathname.startsWith("/toppers") ||
    pathname.startsWith("/wigs")
  ) {
    return null;
  }

  return <Navbar />;
}
