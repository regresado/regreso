"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { TagInput, type Tag } from "emblor";
import {
  GalleryVerticalEnd,
  ListPlus,
  Loader2,
  Map,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { List, listSchema } from "~/server/models";

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
import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/hooks/use-toast";
import { TiltCard } from "~/components/tilt-card";

export function ListCard(props: List) {
  return (
    <Card>
      <CardHeader className="px-3 pt-4 pb-2 text-sm">
        <CardTitle className="truncate">
          <Link href={`/map/${props.id}`}>{props.name ?? "Unnamed Map"}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0 text-sm ">
        <p className="text-muted-foreground">
          {props.description ?? "No description provided."}
        </p>
        {props.tags && props.tags?.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-2">
            {props.tags.map((tag) => (
              <Link key={tag.id} href={`/search/pins?tags=${tag.text}`}>
                <Badge variant="secondary">{tag.text}</Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function RecentLists() {
  const utils = api.useUtils();

  const {
    data: recentLists = [],
    refetch,
    isFetching,
  } = api.list.getMany.useQuery({
    limit: 3,
    order: "DESC",
  });
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof listSchema>>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
    },
  });

  function onSubmit(data: z.infer<typeof listSchema>) {
    createList.mutate({ ...data });
  }
  const createList = api.list.create.useMutation({
    onSuccess: async () => {
      await utils.list.invalidate();
      form.reset();
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
            <CardTitle className="flex flex-row justify-between items-center">
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
            {recentLists.length > 0 ? (
              recentLists.map((dest: List) => {
                return <ListCard key={dest.id} {...dest} />;
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                🌌 No destinations found. Try creating one and come back!
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
        <main className="pt-0 flex  flex-1 flex-col space-y-6 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
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
                      All destinations added to this map will be searchable
                      using these tags.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={createList.isPending || !form.formState.isValid}
                size="sm"
              >
                {createList.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Plus />
                )}

                {createList.isPending ? "Creating Map..." : "Create Map"}
              </Button>
            </form>
          </Form>
        </main>
      </DialogContent>
    </Dialog>
  );
}
