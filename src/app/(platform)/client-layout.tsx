"use client";

import { useState } from "react";
import type { User, Session } from "~/server/models";
import { SidebarLeft } from "~/components/sidebar-left";
import { SidebarRight } from "~/components/sidebar-right";

import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
  user: User | null;
  session: Session | null;
}

export function ClientLayout({ children, user, session }: ClientLayoutProps) {
  const [currentUser, setUser] = useState<User | null>(user);
  const [currentSession, setSession] = useState<Session | null>(session);

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>{children}</SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
