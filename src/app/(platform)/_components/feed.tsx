"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDroppable } from "@dnd-kit/core";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type UseTRPCMutationResult } from "@trpc/react-query/shared";
import { api } from "~/trpc/react";
import { TagInput, type Tag } from "emblor";
import {
  ArrowRight,
  Flame,
  Forklift,
  GalleryVerticalEnd,
  ListPlus,
  Loader2,
  Map,
  Pencil,
  Plus,
  RefreshCw,
  Rss,
  Shovel,
  Star,
  StarOff,
} from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import {
  type feedFormSchema,
  type Destination,
  type Feed,
  type updateFeedSchema,
  type User,
  type Workspace,
} from "~/server/models";

import { timeSince } from "~/lib/utils";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toast } from "~/components/hooks/use-toast";
import { TiltCard } from "~/components/tilt-card";

import { DestinationCard } from "./destination";


export function FeedCard(props: Feed) {

  return (
        <Card>
                <CardHeader className="px-3 pb-2 pt-4 text-sm leading-tight">
            <CardTitle className="truncate">
              <Link href={`/map/${props.id}`}>
                <span className="mr-2 leading-tight">
                  {props?.emoji ?? "❔"}
                </span>
                {props.name ?? "Unnamed Feed"}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pb-3 pt-0 text-sm">
            <p className="text-muted-foreground">
              {props.description ?? "No description provided."}
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <Tooltip>
                <TooltipTrigger>
                  {(props.updatedAt &&
                    "Updated " + timeSince(props.updatedAt) + " ago") ??
                    "Created " + timeSince(props.createdAt) + " ago"}
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {props.updatedAt?.toISOString() ??
                      props.createdAt.toISOString()}
                  </p>
                </TooltipContent>
              </Tooltip>

              <p>•</p>

              {props.size != null && props.size != undefined && (
                <p className="font-muted mr-0.5 text-sm">
                  {props.size} destination{props.size == 1 ? null : "s"}
                </p>
              )}

                           <Link href={`/box/${props.workspace.id}`}>
                <Badge variant="outline">
                  {(props.workspace.emoji ?? "❔") + " " + props.workspace.name}
                </Badge>
              </Link>
              {props.workspace.archived ? null : props.archived ? (
                <Badge variant="destructive">Archived</Badge>
              ) : null}
            </div>
          </CardContent>
  
      </Card>

  );
}

type CreateFeedInput = z.infer<typeof feedFormSchema>;
type UpdateFeedInput = z.infer<typeof updateFeedSchema>;

type MutationFn<T> = (callback?: () => void) => UseTRPCMutationResult<
  { success: boolean },
  TRPCClientErrorLike<{
    input: T;
    output: { success: boolean };
    transformer: true;
    errorShape: { message: string };
  }>,
  T,
  unknown
>;

type FeedFormProps =
  | {
      feedMutation: (callback?: () => void) => UseTRPCMutationResult<
        { success: boolean },
        TRPCClientErrorLike<{
          input: UpdateFeedInput;
          output: { success: boolean };
          transformer: true;
          errorShape: { message: string };
        }>,
        UpdateFeedInput,
        unknown
      >;
      update: true;
      updateId: number;
      defaultValues?: z.infer<typeof feedFormSchema>;
    }
  | {
      feedMutation: (callback?: () => void) => UseTRPCMutationResult<
        { success: boolean },
        TRPCClientErrorLike<{
          input: CreateFeedInput;
          output: { success: boolean };
          transformer: true;
          errorShape: { message: string };
        }>,
        CreateFeedInput,
        unknown
      >;
      update: false;
      defaultValues?: z.infer<typeof feedFormSchema>;
    };

export function FeedForm(
  props: FeedFormProps & {
    workspace?: Workspace;
    user?: User;
    workspaces?: Workspace[];
  },
) {
  const form = useForm<z.infer<typeof feedFormSchema>>({
    defaultValues: {
      name: props.defaultValues?.name ?? "",
      description: props.defaultValues?.description ?? "",
      emoji: props.defaultValues?.emoji ?? "🗺️",
      workspaceId: props.defaultValues?.workspaceId ?? 0,
      visibility: props.defaultValues?.visibility ?? "public",
      query: props.defaultValues?.query ?? { limit: 0 }
    } as z.infer<typeof feedFormSchema>,
  });
  const submitMutation = props.feedMutation(() => {
    form.reset();
  });

  function onSubmit(data: z.infer<typeof feedFormSchema>) {
    if (props.update) {
      if (!props.updateId) {
        return;
      }
      submitMutation.mutate({ ...data, id: props.updateId });
    } else {
      submitMutation.mutate({ ...data, id: 0 });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="flex w-full flex-row items-end gap-4">
          <FormField
            control={form.control}
            name="emoji"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel>Emoji</FormLabel>
                <FormControl>
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          {form.watch("emoji") != undefined &&
                          form.watch("emoji").length > 0
                            ? form.watch("emoji")
                            : "❔"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Picker
                          data={data}
                          value={form.watch("emoji")}
                          onEmojiSelect={(emoji: { native: string }) => {
                            form.setValue("emoji", emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grow">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Bird Articles" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A feed which can be accessed and consumed through RSS."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
 
        <div className="flex flex-row items-end justify-end gap-4">
          <FormField
            control={form.control}
            name="workspaceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trunk</FormLabel>

                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="space-between min-w-[120px]">
                      <SelectValue placeholder="Trunk" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Trunk</SelectLabel>

                      {props.workspaces
                        ?.filter((w) => !w.archived)
                        .map((workspace) => {
                          return (
                            <SelectItem
                              value={workspace.id.toString()}
                              key={workspace.id.toString()}
                            >
                              {workspace.name}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={submitMutation.isPending || !form.formState.isValid}
            size="sm"
          >
            {props.update ? (
              <>
                {submitMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Pencil />
                )}

                {submitMutation.isPending ? "Updating Feed..." : "Update Feed"}
              </>
            ) : (
              <>
                {submitMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus />
                )}

                {submitMutation.isPending ? "Creating Feed..." : "Create Feed"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function RecentFeeds({
  workspace,
  user,
  workspaces,
}: {
  workspace?: Workspace;
  user?: User;
  workspaces?: Workspace[];
}) {
  const utils = api.useUtils();

  const {
    data: recentFeeds = { items: [], count: 0 },
    refetch,
    isFetching,
  } = api.feed.getMany.useQuery({
    limit: 3,
    order: "DESC",
    sortBy: "updatedAt",
    archived: workspace?.archived ? undefined : false,
    workspaceId: workspace?.id ?? undefined,

  });
  const [open, setOpen] = useState(false);

  const createFeed = (callback?: () => void) =>
    api.feed.create.useMutation({
      onSuccess: async () => {
        await utils.feed.invalidate();
        if (typeof callback === "function") {
          callback();
        }
        setOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Failed to create feed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <TiltCard>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              <Link href="/search/feeds">
                <div className="flex items-center">
                  <Map className="mr-2 h-5 w-5" /> Popular Feeds
                </div>
              </Link>

              <Button
                disabled={workspace?.archived}
                onClick={() => setOpen(true)}
                size="sm"
              >
                <ListPlus />
                Create Feed
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            {recentFeeds.items.length > 0 ? (
              recentFeeds.items.map((fd: Feed) => {
                return <FeedCard key={fd.id} {...fd} />;
              })
            ) : (
              <p className="text-sm text-muted-foreground">
               📡 No feeds found. Try creating one and come back!
              </p>
            )}
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={isFetching}
                asChild
              >
                <Link
                  href={`/search/feeds${workspace ? "?workspace=" + workspace.id : ""}`}
                >
                  <GalleryVerticalEnd />
                  See All
                </Link>
              </Button>
              <Button
                size="sm"
                disabled={isFetching}
                onClick={() => {
                  void refetch();
                }}
              >
                <RefreshCw
                  className={isFetching ? "animate-spin" : undefined}
                />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </TiltCard>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListPlus /> Create Feed
          </DialogTitle>
        </DialogHeader>
        <main className="flex flex-1 flex-col space-y-6 pt-0">
          <FeedForm
            workspace={workspace}
            user={user}
            workspaces={workspaces}
            update={false}
            feedMutation={createFeed as MutationFn<CreateFeedInput>}
            defaultValues={{
              name: "",
              description: "",
              emoji: "📡",
              workspaceId: 0,
              visibility: "public",
              query: { limit: 0, offset: 0 }
            }}
          />
        </main>
      </DialogContent>
    </Dialog>
  );
}

export function FeedPage(props: {
  id: string;
  workspaces?: Workspace[];
  user?: User;
}) {
  const utils = api.useUtils();

  const feedId = props.id;
  const [editing, setEditing] = useState(false);

  const updateFeed = (callback?: () => void) =>
    api.feed.update.useMutation({
      onSuccess: async () => {
        await utils.feed.invalidate();
        toast({
          title: "Feed updated",
          description: "Successfully updated feed properties.",
        });
        if (typeof callback === "function") {
          callback();
        }
        setEditing(false);
      },
      onError: (error) => {
        toast({
          title: "Failed to update feed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const archiveMutation = updateFeed();

  const { data }: { data: Feed | undefined } = api.feed.get.useQuery(
    { id: parseInt(feedId ?? "0", 10) },
    { enabled: !!feedId },
  );

  const [pageNumber, setPageNumber] = useState(1);

  const {
    data: searchResults = { count: 0, items: [] },
    refetch,
    isFetching,
  } = api.destination.getMany.useQuery(data?.query ?? {limit: 0});

  function handleOpenChange(openStatus: boolean) {
    setEditing(openStatus);
  }
  function handleArchivalToggle() {
    if (data?.archived) {
      void archiveMutation.mutate({
        id: data?.id,
        archived: false,
      });
    } else if (data) {
      void archiveMutation.mutate({
        id: data?.id,
        archived: true,
      });
    } else {
      toast({
        title: "Failed to update feed",
        description: "No feed selected.",
        variant: "destructive",
      });
    }
  }
  return editing ? (
    <Dialog open={editing} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-y-auto md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Feed</DialogTitle>
        </DialogHeader>
        {editing && data != undefined ? (
          <FeedForm
            workspaces={props.workspaces}
            user={props.user}
            update={true}
            defaultValues={
              {
                name: data.name ?? "",
                description: data.description ?? "",
                emoji: data.emoji ?? "🗺️",
                visibility: "private",
                workspaceId: data.workspace.id ?? undefined,
                query: { limit: 0}
              } as z.infer<typeof feedFormSchema>
            }
            updateId={parseInt(props.id)}
            feedMutation={updateFeed as MutationFn<UpdateFeedInput>}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  ) : (
    <div className="w-full space-y-4 p-6">
      <div className="flex w-full flex-row flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center">
            <span className="mr-2 text-2xl">{data?.emoji ?? "❔"}</span>

            <h1>{data?.name ?? "Unnamed Feed"}</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {data?.description ?? "No description provided."}
          </p>
        </div>
        <div className="flex flex-row gap-2">
                  <Button
            size="sm"
            onClick={() => {
              setEditing(true);
            }}
          >
            <Pencil /> Edit
          </Button>
          {data?.archived ? (
            <Button
              size="sm"
              variant="secondary"
              className="flex flex-shrink"
              onClick={handleArchivalToggle}
            >
              <Forklift />
              Excavate
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex flex-shrink"
                >
                  <Shovel />
                  Bury
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. Are you sure you want to bury
                    this feed? It will be hidden from the dashboard and other
                    pages (except search) until you excavate it.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" onClick={handleArchivalToggle}>
                      Confirm
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Dialog>
            <DeleteFeed id={parseInt(props.id)} routePath="/search/feeds">
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Flame />
                  Burn
                </Button>
              </DialogTrigger>
            </DeleteFeed>
          </Dialog>
        </div>
      </div>
    
      <div className="mt-2 flex flex-wrap gap-2 text-sm">
        Trunk:{" "}
        <Badge variant={data?.workspace.archived ? "destructive" : "outline"}>
          {data?.workspace.emoji ?? "❔"} {data?.workspace.name}{" "}
          <span className="ml-1 italic">
            {data?.workspace.archived ? "(Archived)" : null}
          </span>
        </Badge>
      </div>

      <div className="font-muted flex flex-row space-x-2 text-sm italic">
        {data?.size != undefined ? (
          <div className="flex flex-row space-x-2 pr-2">
            <p className="font-muted text-sm not-italic">
              {data?.size} destinations{" "}
            </p>
            <p>•</p>
          </div>
        ) : null}

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {(data?.updatedAt &&
                "Updated " +
                  timeSince(data?.updatedAt ?? new Date()) +
                  " ago") ??
                "Created " + timeSince(data?.createdAt ?? new Date()) + " ago"}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {data?.updatedAt?.toISOString() ?? data?.createdAt.toISOString()}
            </p>
          </TooltipContent>
        </Tooltip>
        {data?.archived ? (
          <>
            <p className="ml-3">•</p>
            <Badge className="ml-3 not-italic" variant="destructive">
              Archived
            </Badge>
          </>
        ) : null}
      </div>

      {data != undefined ? (
        <div className="block space-y-4">
          <Separator />
          {searchResults.items.length > 0 ? (
            searchResults.items.map((dest: Destination) => {
              return <DestinationCard key={dest.id} {...dest} />;
            })
          ) : isFetching ? (
            <p className="justify-center text-sm text-muted-foreground">
              🔍 Searching...
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              🌌 No destinations found. Try{" "}
              <Link href="/dashboard">creating one</Link> and come back!
            </p>
          )}
          <Pagination>
            <PaginationContent>
              <Popover>
                {pageNumber != 1 && !isFetching ? (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => {
                        setPageNumber(pageNumber - 1);

                        void refetch();
                      }}
                    />
                  </PaginationItem>
                ) : null}
                {(Math.ceil(searchResults.count / 6) <= 4
                  ? Array.from(
                      { length: Math.ceil(searchResults.count / 6) },
                      (x, i) => i + 1,
                    )
                  : pageNumber <= 2
                    ? [1, 2, 3, "...", Math.ceil(searchResults.count / 6)]
                    : pageNumber >= Math.ceil(searchResults.count / 6) - 1
                      ? [
                          1,
                          "...",
                          Math.ceil(searchResults.count / 6) - 2,
                          Math.ceil(searchResults.count / 6) - 1,
                          Math.ceil(searchResults.count / 6),
                        ]
                      : [
                          1,
                          "...",
                          pageNumber,
                          "...",
                          Math.ceil(searchResults.count / 6),
                        ]
                ).map((page) => {
                  if (typeof page === "number") {
                    return (
                      <PaginationItem key={page} className="font-semibold">
                        <PaginationLink
                          href="#"
                          onClick={() => {
                            setPageNumber(page);

                            void refetch();
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page} className="pointer-events-none">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                })}
                {pageNumber != Math.ceil(searchResults.count / 6) &&
                !isFetching ? (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => {
                        setPageNumber(pageNumber + 1);

                        void refetch();
                      }}
                    />
                  </PaginationItem>
                ) : null}
              </Popover>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}

export function DeleteFeed({
  id,
  children,
  routePath,
}: {
  id: number;
  children: React.ReactNode;
  routePath: string;
}) {
  const router = useRouter();

  const utils = api.useUtils();

  const deleteFeed = api.feed.delete.useMutation({
    onSuccess: async () => {
      await utils.feed.invalidate();
      router.push(routePath);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete feed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  return (
    <Dialog>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this feed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                deleteFeed.mutate({ id: parseInt(id.toString()) });
              }}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
