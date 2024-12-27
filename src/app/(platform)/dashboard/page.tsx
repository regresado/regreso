"use client";

import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { WelcomeCard } from "~/components/welcome-card";
import { SidebarTrigger } from "~/components/ui/sidebar";

import type { User } from "~/server/models";

import { Home } from "lucide-react";

export default function DashboardHome(user: User) {
  return (
    <>
      <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Home size="16" />
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {/* <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/workspace/">
                  🖼️ Frontend Development
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  🎨 Design Components
                </BreadcrumbPage>
              </BreadcrumbItem> */}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-muted/50">
            <WelcomeCard
              teams={[
                {
                  name: "My Team",
                  logo: Home,
                  plan: "Free",
                },
              ]}
              name={user.displayName}
            />
          </div>
          <div className="rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}
