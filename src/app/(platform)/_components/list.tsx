"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type UseTRPCMutationResult } from "@trpc/react-query/shared";
import { api } from "~/trpc/react";
import { TagInput, type Tag } from "emblor";
import {
  ArrowRight,
  GalleryVerticalEnd,
  ListPlus,
  Loader2,
  Map,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  listSchema,
  updateListSchema,
  type Destination,
  type List,
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
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/hooks/use-toast";
import { TiltCard } from "~/components/tilt-card";

import { DestinationCard } from "./destination";

export function ListCard(props: List) {
  return (
    <Card>
      <CardHeader className="px-3 pb-2 pt-4 text-sm">
        <CardTitle className="truncate">
          <Link href={`/map/${props.id}`}>{props.name ?? "Unnamed Map"}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pb-3 pt-0 text-sm">
        <p className="text-muted-foreground">
          {props.description ?? "No description provided."}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {props.size && (
            <p className="font-muted text-sm">{props.size} destinations</p>
          )}
          <p>•</p>
          {(props.updatedAt &&
            "Updated " + timeSince(props.updatedAt) + " ago") ??
            "Updated " + timeSince(props.createdAt) + " ago"}

          {props.tags && props.tags?.length > 0
            ? props.tags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2">
                  <p>•</p>

                  <Link href={`/search/pins?tags=${tag.text}`}>
                    <Badge variant="secondary">{tag.text}</Badge>
                  </Link>
                </div>
              ))
            : null}
        </div>
      </CardContent>
    </Card>
  );
}

type ListFormProps =
  | {
      listMutation: (callback?: () => void) => UseTRPCMutationResult<
        { success: boolean },
        TRPCClientErrorLike<{
          input: z.infer<typeof updateListSchema>;
          output: { success: boolean };
          transformer: true;
          errorShape: { message: string };
        }>,
        z.infer<typeof updateListSchema>,
        unknown
      >;
      update: true;
      updateId: number;
      defaultValues?: z.infer<typeof listSchema>;
    }
  | {
      listMutation: (callback?: () => void) => UseTRPCMutationResult<
        { success: boolean },
        TRPCClientErrorLike<{
          input: z.infer<typeof listSchema>;
          output: { success: boolean };
          transformer: true;
          errorShape: { message: string };
        }>,
        z.infer<typeof listSchema>,
        unknown
      >;
      update: false;
      defaultValues?: z.infer<typeof listSchema>;
    };

export function ListForm(props: ListFormProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const form = useForm<z.infer<typeof listSchema>>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      name: props.defaultValues?.name ?? "",
      description: props.defaultValues?.description ?? "",
      tags: props.defaultValues?.tags ?? [],
    },
  });

  useEffect(() => {
    setTags(props.defaultValues?.tags ?? []);
  }, [props.defaultValues?.tags]);

  const submitMutation = props.listMutation(() => {
    form.reset();
    setTags([]);
  });

  function onSubmit(data: z.infer<typeof listSchema>) {
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Pelican Resources" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A list of resources for raising pelicans at home."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-left">Tags</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="Enter some tags..."
                  tags={tags}
                  className="sm:min-w-[450px]"
                  setTags={(newTags) => {
                    setTags(newTags);
                    form.setValue("tags", newTags as [Tag, ...Tag[]]);
                  }}
                  styleClasses={{
                    input: "w-full sm:max-w-[350px]",
                  }}
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                />
              </FormControl>
              <FormDescription>
                All maps added to this map will be searchable using these tags.
              </FormDescription>
              <FormMessage />
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

              {submitMutation.isPending ? "Updating Map..." : "Update Map"}
            </>
          ) : (
            <>
              {submitMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}

              {submitMutation.isPending ? "Creating Map..." : "Create Map"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export function RecentLists() {
  const utils = api.useUtils();

  const {
    data: recentLists = { items: [], count: 0 },
    refetch,
    isFetching,
  } = api.list.getMany.useQuery({
    limit: 3,
    order: "DESC",
  });
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const createList = (callback?: () => void) =>
    api.list.create.useMutation({
      onSuccess: async () => {
        await utils.list.invalidate();
        if (typeof callback === "function") {
          callback();
        }
        setOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Failed to update map",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  //   const { data }: { data: List | undefined } = api.list.getMany.useQuery(
  //     ,
  //   );

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <TiltCard>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              <Link href="/search/maps">
                <div className="flex items-center">
                  <Map className="mr-2 h-5 w-5" /> Recent Maps
                </div>
              </Link>

              <Button onClick={() => setOpen(true)} size="sm">
                <ListPlus />
                Create Map
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6">
            {recentLists.items.length > 0 ? (
              recentLists.items.map((lst: List) => {
                return <ListCard key={lst.id} {...lst} />;
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                🗺️ No maps found. Try creating one and come back!
              </p>
            )}
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={isFetching}
                asChild
              >
                <Link href="/search/pins">
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
            <ListPlus /> Create Map
          </DialogTitle>
        </DialogHeader>
        <main className="flex flex-1 flex-col space-y-6 pt-0">
          <ListForm update={false} listMutation={createList} />
        </main>
      </DialogContent>
    </Dialog>
  );
}

export function ListPage(props: { id: string }) {
  const utils = api.useUtils();

  const router = useRouter();
  const listId = props.id;
  const [editing, setEditing] = useState(false);

  const updateList = (callback?: () => void) =>
    api.list.update.useMutation({
      onSuccess: async () => {
        await utils.list.invalidate();
        if (typeof callback === "function") {
          callback();
        }
        setEditing(false);
      },
      onError: (error) => {
        toast({
          title: "Failed to update map",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  const deleteList = api.list.delete.useMutation({
    onSuccess: async () => {
      await utils.list.invalidate();
      router.push("/search/maps");
    },
    onError: (error) => {
      toast({
        title: "Failed to update map",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data }: { data: List | undefined } = api.list.get.useQuery(
    { id: parseInt(listId ?? "0", 10) },
    { enabled: !!listId },
  );

  const [pageNumber, setPageNumber] = useState(1);

  const {
    data: searchResults = { count: 0, items: [] },
    refetch,
    isFetching,
  } = api.destination.getMany.useQuery({
    lists: [parseInt(listId)],
    offset: Math.round(pageNumber - 1) * 6,
    limit: 6,
  });

  function handleOpenChange(openStatus: boolean) {
    setEditing(openStatus);
  }
  return editing ? (
    <Dialog open={editing} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-y-auto md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Map</DialogTitle>
        </DialogHeader>
        {editing && data != undefined ? (
          <ListForm
            update={true}
            defaultValues={{
              ...data,
              name: data.name ?? "",
              description: data.description ?? "",
              tags:
                data.tags?.map((tag) => ({
                  id: tag.id.toString(),
                  text: tag.text,
                })) ?? [],
            }}
            updateId={parseInt(props.id)}
            listMutation={updateList}
          />
        ) : null}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="destructive">
              Delete Map
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this map?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={() => {
                    deleteList.mutate({ id: parseInt(props.id) });
                  }}
                >
                  Confirm
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  ) : (
    <div className="w-full space-y-4 p-6">
      <div className="flex w-full flex-row flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1>{data?.name ?? "Unnamed Map"}</h1>
          <p className="text-sm text-muted-foreground">
            {data?.description ?? "No description provided."}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(true);
          }}
        >
          <Pencil /> Edit Map
        </Button>
      </div>
      {data?.tags && data?.tags?.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          Tags:{" "}
          {data?.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.text}
            </Badge>
          ))}
        </div>
      ) : null}
      <div className="font-muted flex flex-row space-x-2 text-sm italic">
        {data?.size && (
          <div className="flex flex-row space-x-2 pr-2">
            <p className="font-muted text-sm not-italic">
              {data?.size} destinations{" "}
            </p>
            <p>•</p>
          </div>
        )}

        {(data?.updatedAt &&
          "Updated " +
            timeSince(data?.updatedAt ?? data?.createdAt ?? new Date()) +
            " ago") ??
          "Updated " + timeSince(data?.createdAt ?? new Date()) + " ago"}
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

                        refetch();
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
                  if (page === "...") {
                    return (
                      <PopoverTrigger key={page}>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      </PopoverTrigger>
                    );
                  } else if (typeof page === "number") {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber == page}
                          onClick={() => {
                            setPageNumber(page);
                            refetch();
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                })}

                <PopoverContent className="w-[200px]">
                  <div className="flex flex-row items-center gap-2 text-sm">
                    Page:
                    <Input
                      type="number"
                      value={pageNumber}
                      onChange={(event) => {
                        setPageNumber(parseInt(event.target.value));
                      }}
                    />
                    <Button
                      size="icon"
                      type="submit"
                      className="h-8 min-w-8"
                      onClick={() => {
                        refetch();
                      }}
                    >
                      {isFetching ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <ArrowRight />
                      )}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {pageNumber != Math.ceil(searchResults.count / 6) &&
              !isFetching ? (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => {
                      setPageNumber(pageNumber + 1);
                      refetch();
                    }}
                  />
                </PaginationItem>
              ) : null}
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}
