import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the admin dashboard",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
