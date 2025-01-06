"use client";

import React from "react";

import { Active, DndContext, DragEndEvent, Over } from "@dnd-kit/core";
import { Sailboat } from "lucide-react";
import type { User } from "~/server/models";

import { WelcomeCard } from "~/components/welcome-card";

import {
  CreateDestination,
  RecentDestinations,
} from "../_components/destination";
import { RecentLists } from "../_components/list";

const DashboardHome: React.FC = (props: { user?: User }) => {
  const [dragEnd, setDragEnd] = React.useState<{
    over: Over;
    active: Active;
  } | null>(null);
  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    if (over && active) {
      setDragEnd({ over: over, active: active });
    }
  }
  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
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
          <div className="z-50 col-span-1 xl:col-span-2">
            <div className="rounded-xl bg-muted/50">
              <RecentDestinations dragEnd={dragEnd} setDragEnd={setDragEnd} />
            </div>
          </div>
          <div className="col-span-1 xl:col-span-3">
            <div className="rounded-xl bg-muted/50">
              <RecentLists />
            </div>
          </div>
        </div>
      </DndContext>
    </>
  );
};

export default DashboardHome;
