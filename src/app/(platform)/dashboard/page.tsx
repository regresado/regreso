"use client";

import React from "react";

import { WelcomeCard } from "~/components/welcome-card";

import type { User } from "~/server/models";

import { Command } from "lucide-react";

export default function DashboardHome(user: User) {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-muted/50">
            <WelcomeCard
              teams={[
                {
                  name: "My Team",
                  logo: Command,
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
