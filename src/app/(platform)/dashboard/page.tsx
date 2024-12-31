"use client";

import React from "react";

import { Command } from "lucide-react";
import type { User } from "~/server/models";

import { WelcomeCard } from "~/components/welcome-card";

import {
  CreateDestination,
  RecentDestinations,
} from "~/app/(platform)/_components/destination";

const DashboardHome: React.FC = (props: { user?: User }) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-5">
        <div className="col-span-1 xl:col-span-2">
          <div className="rounded-xl bg-muted/50">
            <WelcomeCard
              teams={[
                {
                  name: "My Squad",
                  logo: Command,
                  plan: "Free",
                },
              ]}
              name={props.user?.displayName}
            />
          </div>
        </div>
        <div className="col-span-1 xl:col-span-3">
          <div className="rounded-xl bg-muted/50">
            <CreateDestination />
          </div>
        </div>
        <div className="col-span-1 xl:col-span-2">
          <div className="rounded-xl bg-muted/50">
            <RecentDestinations />
          </div>
        </div>
        <div className="col-span-1 min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4 md:min-h-min xl:col-span-3" />
      </div>
    </>
  );
};

export default DashboardHome;
