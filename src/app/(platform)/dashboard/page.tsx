"use client";

import React from "react";

import { Sailboat } from "lucide-react";
import type { User } from "~/server/models";

import { WelcomeCard } from "~/components/welcome-card";

import {
  CreateDestination,
  RecentDestinations,
} from "../_components/destination";
import { RecentLists } from "../_components/list";

const DashboardHome: React.FC = (props: { user?: User }) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-5">
        <div className="col-span-1 xl:col-span-2">
          <div className="rounded-xl bg-muted/50">
            <WelcomeCard
              teams={[
                {
                  name: "My Crew",
                  logo: Sailboat,
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
        <div className="col-span-1 xl:col-span-3">
          <div className="rounded-xl bg-muted/50">
            <RecentLists />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
