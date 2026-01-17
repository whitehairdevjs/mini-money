"use client";

import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/common/Navigation";
import { usePathname } from "next/navigation";

function ClientLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavigation = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideNavigation && <Navigation />}
      <main>{children}</main>
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </AuthProvider>
    </QueryProvider>
  );
}
