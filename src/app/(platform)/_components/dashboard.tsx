"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DndContext,
  type Active,
  type DragEndEvent,
  type Over,
} from "@dnd-kit/core";
import { api } from "~/trpc/react";
import { AlertCircle, Binoculars, Rocket } from "lucide-react";
import { motion } from "motion/react";
import { useOnborda } from "onborda";
import type { User, Workspace } from "~/server/models";

import { timeSince } from "~/lib/utils";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "~/components/hooks/use-toast";
import { TiltCard } from "~/components/tilt-card";

import { CreateDestination, RecentDestinations } from "./destination";
import { RecentLists } from "./list";
import { RecentTags } from "./tag";
import { RecentWorkspacesDropdown } from "./workspace";

export function WelcomeCard({
  workspace,
  user,
  workspaces,
  isFetchingWorkspaces,
}: {
  workspace?: Workspace;
  user?: User;
  workspaces?: Workspace[];
  isFetchingWorkspaces?: boolean;
}) {
  const { startOnborda } = useOnborda();

  return (
    <TiltCard>
      <Card>
        <CardHeader className="px-3 pb-4 xs:px-6 xs:pt-6 sm:px-3 sm:pt-4 lg:px-6 lg:pt-6">
          <CardTitle className="leading-relaxed">
            {workspace
              ? `${workspace.emoji} ${workspace.name}`
              : `👋 Welcome ${user?.name ?? " to Regreso"},`}
          </CardTitle>
          <CardDescription className={workspace ? "mt-8" : undefined}>
            {workspace
              ? workspace.description
              : "Learn the basics of how to use Regreso."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-3 pt-0 xs:px-6 xs:pb-6 sm:px-3 sm:pb-4 lg:px-6 lg:pb-6">
          {workspace ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm">
                    Created {timeSince(workspace.createdAt)} ago
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{workspace.createdAt.toISOString()}</p>
                </TooltipContent>
              </Tooltip>
              {workspace.destinationCount != null &&
                workspace.destinationCount != undefined && (
                  <>
                    <p>•</p>
                    <p className="font-muted mr-0.5 text-sm">
                      {workspace.destinationCount} destination
                      {workspace.destinationCount == 1 ? null : "s"}
                    </p>
                  </>
                )}{" "}
              {workspace.listCount != null &&
                workspace.listCount != undefined && (
                  <>
                    <p>•</p>

                    <p className="font-muted mr-0.5 text-sm">
                      {workspace.listCount} map
                      {workspace.listCount == 1 ? null : "s"}
                    </p>
                  </>
                )}{" "}
              {workspace.tagCount != null &&
                workspace.tagCount != undefined && (
                  <>
                    <p>•</p>

                    <p className="font-muted mr-0.5 text-sm">
                      {workspace.tagCount} tag
                      {workspace.tagCount == 1 ? null : "s"}
                    </p>
                  </>
                )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button size="sm" variant="outline" asChild>
                <Link href="/guide">
                  <Rocket />
                  <div className="flex flex-row">
                    <span className="mx-0 mr-1 hidden xs:block sm:hidden md:block">
                      Setup
                    </span>
                    Guide
                  </div>
                </Link>
              </Button>
              <Button
                size="sm"
                id="start-tour"
                onClick={() => {
                  startOnborda("welcome-tour");
                }}
              >
                <Binoculars />{" "}
                <div className="flex flex-row">
                  <span className="mx-0 mr-1 hidden xs:block sm:hidden md:block">
                    Start
                  </span>
                  Tour
                </div>
              </Button>
            </div>
          )}
          <Separator className={workspace ? "mt-0" : undefined} />
          <RecentWorkspacesDropdown
            workspace={workspace}
            recentWorkspaces={workspaces ?? []}
            isFetchingWorkspaces={isFetchingWorkspaces}
            user={user}
          />
        </CardContent>
      </Card>
    </TiltCard>
  );
}

export function Dashboard(props: {
  workspace?: Workspace;
  user?: User;
  workspaces?: Workspace[];
}) {
  const utils = api.useUtils();
  const router = useRouter();

  const [dragEnd, setDragEnd] = useState<{
    over: Over;
    active: Active;
  } | null>(null);
  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    if (over && active) {
      setDragEnd({ over: over, active: active });
    }
  }
  const unarchiveWorkspace = api.workspace.update.useMutation({
    onSuccess: async () => {
      await utils.list.invalidate();
      toast({
        title: "Trunk updated",
        description: "Successfully updated trunk properties.",
      });
      await utils.workspace.invalidate();
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Failed to update trunk",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function handleUnarchiving() {
    if (props.workspace?.archived) {
      unarchiveWorkspace.mutate({
        id: props.workspace.id,
        archived: false,
      });
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full flex-col gap-4 p-4">
        {props.workspace?.archived ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Burial Notice</AlertTitle>
            <AlertDescription className="flex w-full flex-col justify-between gap-1 lg:flex-row lg:items-center">
              This trunk is buried, meaning it&apos;s preserved but uneditable.
              <Button onClick={handleUnarchiving} variant="outline" size="sm">
                Excavate Trunk
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="z-10 grid grid-cols-1 gap-4 xl:grid-cols-5">
          <div className="col-span-1 xl:col-span-2">
            <div className="rounded-xl bg-muted/50">
              <motion.div
                initial={{ opacity: 0.5, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0,
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <WelcomeCard
                  workspace={props.workspace}
                  user={props.user}
                  workspaces={props.workspaces}
                />
              </motion.div>
            </div>
          </div>
          <div className="col-span-1 xl:col-span-3">
            <div className="rounded-xl bg-muted/50">
              <motion.div
                initial={{ opacity: 0.5, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0,
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <CreateDestination
                  workspaces={props?.workspaces}
                  workspace={props?.workspace}
                  user={props?.user}
                />
              </motion.div>
            </div>
          </div>
          <div className="z-50 col-span-1 xl:col-span-2">
            <div className="rounded-xl bg-muted/50">
              <motion.div
                initial={{ opacity: 0.5, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0,
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <RecentDestinations
                  workspace={props?.workspace}
                  dragEnd={dragEnd}
                  setDragEnd={setDragEnd}
                />
              </motion.div>
            </div>
          </div>
          <div className="col-span-1 xl:col-span-3">
            <div className="rounded-xl bg-muted/50">
              <motion.div
                initial={{ opacity: 0.5, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0,
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <RecentLists
                  workspace={props?.workspace}
                  user={props?.user}
                  workspaces={props?.workspaces}
                />
              </motion.div>
            </div>
          </div>
          <div className="col-span-1 xl:col-span-2">
            <div className="rounded-xl bg-muted/50">
              <motion.div
                initial={{ opacity: 0.5, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0,
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <RecentTags
                  workspace={props?.workspace}
                  user={props?.user}
                  workspaces={props?.workspaces}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
