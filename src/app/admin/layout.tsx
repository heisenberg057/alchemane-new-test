"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, SessionProvider, useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/authStore";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login uses bootstrap-session only — avoid /api/auth/session while dev/API is flaky.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, data } = useSession();
  const { login, logout, initialize } = useAuthStore();
  const [adminReady, setAdminReady] = useState(false);

  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) return;
    if (status === "unauthenticated") {
      logout();
      router.replace("/admin/login");
    }
  }, [isLoginRoute, logout, router, status]);

  // Hydrate Zustand with Payload JWT before admin children fetch APIs (accessToken is not persisted)
  useEffect(() => {
    if (isLoginRoute) {
      setAdminReady(true);
      return;
    }

    if (status === "loading") return;

    let cancelled = false;

    async function hydrateAuth() {
      if (status === "unauthenticated") {
        if (!cancelled) setAdminReady(true);
        return;
      }

      try {
        const session = await getSession();
        if (cancelled) return;

        if (session?.user?.accessToken) {
          const role = session.user.role as
            | "SUPER_ADMIN"
            | "ADMIN"
            | "EDITOR"
            | "USER"
            | undefined;
          if (!role) {
            logout();
            router.replace("/admin/login");
            return;
          }
          login(session.user.accessToken, {
            id: String(session.user.id ?? ""),
            name: session.user.name || "Admin",
            email: session.user.email || "",
            role,
            avatar: session.user.image || undefined,
          });
          if (!cancelled) setAdminReady(true);
          return;
        }

        await initialize();
      } finally {
        if (!cancelled) setAdminReady(true);
      }
    }

    hydrateAuth();
    return () => {
      cancelled = true;
    };
  }, [isLoginRoute, status, login, initialize, logout, router]);

  // Legacy: keep store in sync when useSession updates (e.g. token refresh)
  useEffect(() => {
    if (status !== "authenticated" || !data?.user?.accessToken) return;
    login(data.user.accessToken, {
      id: data.user.id,
      name: data.user.name || "Admin",
      email: data.user.email || "",
      role: data.user.role as
        | "SUPER_ADMIN"
        | "ADMIN"
        | "EDITOR"
        | "USER",
      avatar: data.user.image || undefined,
    });
  }, [data?.user, login, status]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (status === "loading" || !adminReady) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading admin…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <div className="hidden md:block fixed inset-y-0 left-0 z-10 flex w-[260px] flex-col">
        <Sidebar className="h-full w-[260px] min-h-0" />
      </div>
      <div className="flex flex-col md:pl-[260px] w-full min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

