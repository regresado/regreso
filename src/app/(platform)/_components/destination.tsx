"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ArrowRight, MapPinPlus } from "lucide-react";

import { Tag, TagInput } from "emblor";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

import { MinimalTiptapEditor } from "~/components/minimal-tiptap";

import { destinationSchema, type Destination } from "~/server/models";
import { api } from "~/trpc/react";

export function CreateDestination() {
  const utils = api.useUtils();
  const createDestination = api.destination.create.useMutation({
    onSuccess: async () => {
      await utils.destination.invalidate();
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof destinationSchema>>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      type: "location",
      location: "",
      name: "",
      body: "",
      tags: [],
      attachments: [],
    },
  });

  function onSubmit(data: z.infer<typeof destinationSchema>) {
    createDestination.mutate(data);
  }
  const [tags, setTags] = useState<Tag[]>([]);
  const [locationConfirmed, confirmLocation] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPinPlus className="mr-2 w-5" /> Create Destination
        </CardTitle>
      </CardHeader>
      <CardContent className="sm:px-3 xl:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div
              className={`flex flex-row items-end xs:space-x-1 xl:space-x-3`}
            >
              <div
                className={`w-${form.watch("type") === "location" ? "1/3" : "full"}`}
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="location">Location</SelectItem>
                          <SelectItem value="note">Note</SelectItem>
                          <SelectItem value="file" disabled>
                            File
                            <Badge variant="secondary" className="ml-2">
                              Soon!
                            </Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("type") == "location" ? (
                <>
                  <div className="w-1/2">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://pelicans.dev"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    size="icon"
                    disabled={form.watch("location") === ""}
                    onClick={() => {
                      confirmLocation(true);
                    }}
                  >
                    <ArrowRight />
                  </Button>
                </>
              ) : null}
            </div>
            {form.watch("type") === "note" ||
            (form.watch("type") === "location" && locationConfirmed) ? (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Coolest Pelicans in the World"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <MinimalTiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full"
                          editorContentClassName="p-5"
                          output="html"
                          placeholder="Type your note here..."
                          editable={true}
                          editorClassName="focus:outline-none"
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
                          activeTagIndex={-1}
                          setActiveTagIndex={() => {}}
                        />
                      </FormControl>
                      <FormDescription>
                        These are the topics that you&apos;re interested in.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}
            <Button type="submit" disabled={createDestination.isPending}>
              {createDestination.isPending ? "Submitting..." : "Submit "}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function RecentDestinations() {
  // query api.destinatioin.recent
  const recentDestinations = api.destination.getRecent.useQuery().data;

  // const [recentDestinations] = api.destination.recent.q();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Destinations</CardTitle>
      </CardHeader>
      <CardContent className="sm:px-3 xl:px-6">
        {recentDestinations
          ? recentDestinations.map((dest) => {
              return (
                <DestinationCard {...dest} />
                // <DestinationCard
                //   destination={{
                //     ...dest,
                //     name: dest.name ?? "Unnamed Destination",
                //     location: dest.location ?? "",
                //     type: dest.type ?? "location",
                //   }}
                // />
              );
            })
          : null}
      </CardContent>
    </Card>
  );
}

export function DestinationCard(props: Destination) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.name ?? "Unnamed Destination"}</CardTitle>
      </CardHeader>
      <CardContent className="sm:px-3 xl:px-6">
        {props.id ? (
          <p className="truncate">
            Your most recent post: {props.name ?? "Unnamed Destination"}
          </p>
        ) : (
          <p>You have no posts yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
