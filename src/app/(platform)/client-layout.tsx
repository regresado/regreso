"use client";

import type { User } from "~/server/models";
import { SidebarLeft } from "~/components/sidebar-left";
import { SidebarRight } from "~/components/sidebar-right";

import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

export function ClientLayout({ children, user }: ClientLayoutProps) {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight user={user} />
    </SidebarProvider>
  );
}
