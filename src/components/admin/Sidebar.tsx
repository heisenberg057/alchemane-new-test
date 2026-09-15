"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  ShoppingBag,
  MessageSquare,
  Users,
  Search,
  Settings,
  ShieldAlert,
  BarChart3,
  Menu,
  LogOut,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const sidebarNavItems = [
  {
    title: "Content",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Posts",
        href: "/admin/posts",
        icon: FileText,
      },
      {
        title: "Pages",
        href: "/admin/pages",
        icon: Globe,
      },
      {
        title: "Media",
        href: "/admin/media",
        icon: ImageIcon,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: ShoppingBag,
      },
      {
        title: "Form Submissions",
        href: "/admin/forms",
        icon: MessageSquare,
      },
      {
        title: "Leads",
        href: "/admin/leads",
        icon: Users,
      },
      {
        title: "Lead optimization",
        href: "/admin/leads/dashboard",
        icon: Users,
      },
      {
        title: "Bulk scoring",
        href: "/admin/leads/scoring",
        icon: Users,
      },
    ],
  },
  {
    title: "Optimization",
    items: [
      {
        title: "SEO",
        href: "/admin/seo",
        icon: Search,
      },
      {
        title: "Keyword Log",
        href: "/admin/seo/keywords",
        icon: Search,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Campaigns",
        href: "/admin/analytics/campaigns",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Integrations",
        href: "/admin/integrations",
        icon: Globe,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Security",
        href: "/admin/security",
        icon: ShieldAlert,
      },
    ],
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data } = useSession();
  const user = data?.user;

  const displayEmail = user?.email ?? "";
  const displayName = user?.name ?? "";
  const initial =
    (displayEmail[0] || displayName[0] || "A").toUpperCase();

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col bg-slate-900 text-slate-100 border-r border-slate-800",
        className
      )}
    >
      <div className="shrink-0 px-4 pt-4 pb-3">
        <h2 className="px-2 text-lg font-semibold tracking-tight text-white flex items-center gap-2">
          <span className="h-6 w-6 shrink-0 rounded-md bg-indigo-500" />
          AHL Admin
        </h2>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2"
        aria-label="Admin navigation"
      >
        <div className="space-y-6 pt-2">
          {sidebarNavItems.map((group, i) => (
            <div key={i}>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-4 space-y-3">
        <div className="flex gap-3 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            {displayEmail ? (
              <p
                className="text-sm font-medium text-white leading-snug break-all line-clamp-2"
                title={displayEmail}
              >
                {displayEmail}
              </p>
            ) : (
              <p className="text-sm font-medium text-white truncate">
                {displayName || "Admin"}
              </p>
            )}
            {displayName && displayEmail && displayName !== displayEmail && (
              <p className="text-xs text-slate-400 truncate" title={displayName}>
                {displayName}
              </p>
            )}
            <p className="text-xs text-slate-400 truncate">
              {(user?.role ?? "ADMIN").toLowerCase().replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-center sm:justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="mr-2 h-4 w-4 shrink-0" />
          Log out
        </Button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[280px] flex-col p-0 bg-slate-900 border-r-slate-800"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <Sidebar className="h-full min-h-0 w-full" />
      </SheetContent>
    </Sheet>
  );
}
