"use client";

import React, { useState, useEffect } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

import type { User } from "~/server/user";
import { getCurrentSession } from "~/server/session";

import type { Session } from "~/server/session";

import { api } from "~/trpc/server";
// app/api/page.tsx
import { redirect } from "next/navigation";

// TODO: Make sure the redirect method is correct.

export default function Page() {
  const [currentUser, setUser] = useState<User | null>({
    id: -1,
    displayName: "John Doe",
    email: "",
    name: "johndoe",
    emailVerified: false,
    registered2FA: false,
  });
  const [currentSession, setSession] = useState<Session | null>(null);
  // TODO: Consider how to implement offline
  useEffect(() => {
    async function getUser() {
      const { session, user } = await getCurrentSession();
      if (user !== null) {
        setUser(user);
      }
      if (session !== null) {
        setSession(session);
      }
    }
    void getUser();
  }, []);

  return (
    <>
      <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  Project Management & Task Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
        <div className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" />
      </div>
    </>
  );
}
