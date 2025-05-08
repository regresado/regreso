"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";
import { Binoculars, PackagePlus, Rocket } from "lucide-react";
import { useOnborda } from "onborda";
import { type Workspace } from "~/server/models";

import { timeSince } from "~/lib/utils";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TiltCard } from "~/components/tilt-card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

export function WelcomeCard({
  workspace,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
  workspace?: Workspace;
}) {
  const { startOnborda } = useOnborda();
  const { data: recentWorkspaces = { items: [], count: 0 }, isFetching } =
    api.workspace.getMany.useQuery({
      limit: 30,
      order: "DESC",
    });

  const router = useRouter();

  const { user } = api.session.get.useQuery({}).data ?? { user: null };
  return (
    <TiltCard>
      <Card>
        <CardHeader className="pb-4">
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
        <CardContent className="space-y-3 pt-0 sm:px-6 xl:px-6">
          {workspace ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-sm">
                Created {timeSince(workspace.createdAt)} ago
              </p>
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
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href="/guide">
                  <Rocket />
                  Setup Guide
                </Link>
              </Button>
              <Button
                size="sm"
                id="start-tour"
                onClick={() => {
                  startOnborda("welcome-tour");
                }}
              >
                <Binoculars /> Start Tour
              </Button>
            </div>
          )}
          <Separator className={workspace ? "mt-0" : undefined} />
          <p className="text-sm font-bold">Switch Workspace</p>

          <div className="flex flex-row space-x-2">
            <Select
              disabled={isFetching}
              onValueChange={(value) => {
                router.push("/box/" + value);
              }}
              defaultValue={(workspace?.id ?? 0).toString()}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Workspaces</SelectItem>
                {recentWorkspaces.items.map((workspace) => (
                  <SelectItem
                    key={workspace.id}
                    value={workspace.id.toString()}
                  >
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm">
              <PackagePlus /> Create
            </Button>
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}
