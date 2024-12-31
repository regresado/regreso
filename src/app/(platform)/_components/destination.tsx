"use client";

import { useActionState, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { TagInput, type Tag } from "emblor";
import {
  ArrowRight,
  Loader2,
  MapPin,
  MapPinPlus,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { destinationSchema, type Destination } from "~/server/models";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/hooks/use-toast";
import { MinimalTiptapEditor } from "~/components/minimal-tiptap";
import { TiltCard } from "~/components/tilt-card";

import { getWebDetailsAction } from "~/app/(platform)/dashboard/actions";

const destinationTypes = ["location", "note", "file"] as const;

const destinationTypeSchema = z.object({
  type: z.enum(destinationTypes),
  location: z.string().url(),
});

export function CreateDestination() {
  const [loading, setLoading] = useState(false);
  const [detailsState, action] = useActionState(getWebDetailsAction, {
    error: undefined,
    url: undefined,
    title: [undefined],
    description: [undefined],
  });

  const destinationTypeForm = useForm<z.infer<typeof destinationTypeSchema>>({
    resolver: zodResolver(destinationTypeSchema),

    defaultValues: {
      type: "location",
      location: "",
    },
  });

  const form = useForm<z.infer<typeof destinationSchema>>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      type: "location",
      location: null,
      name: "",
      body: "",
      tags: [],
      attachments: [],
    },
  });

  useEffect(() => {
    if (!detailsState.error) {
      const names = detailsState.title.filter(String);
      const descriptions = detailsState.description.filter(String);
      form.setValue("name", names[0] ?? "");
      form.setValue("body", descriptions[0] ?? "");
    }
    if (detailsState.url) {
      form.setValue(
        "location",
        detailsState.url ?? destinationTypeForm.watch("location"),
      );
    }
    setLoading(false);

    // confirmLocation(true);
  }, [detailsState, destinationTypeForm, form]);

  // watch for when destinationTypeForm.watch("type") changes
  const type = destinationTypeForm.watch("type");
  useEffect(() => {
    form.reset();
    if (destinationTypeForm.watch("type") === "note") {
      form.setValue("type", "note");
    }
  }, [type, destinationTypeForm, form]);

  const utils = api.useUtils();
  const createDestination = api.destination.create.useMutation({
    onSuccess: async () => {
      form.reset();
      destinationTypeForm.reset();

      await utils.destination.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Failed to create destination",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof destinationSchema>) {
    createDestination.mutate(data);
  }
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const {
    trigger,
    formState: { isValid },
  } = form;

  return (
    <TiltCard>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPinPlus className="mr-2 h-5 w-5" /> New Destination
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          <Form {...destinationTypeForm}>
            <form
              action={action}
              onSubmit={async (e) => {
                if (!isValid) {
                  e.preventDefault();
                  await trigger();
                  return;
                }
                setLoading(true);
                form.reset();

                e.currentTarget?.requestSubmit();
              }}
            >
              <div className={`flex w-full flex-row flex-wrap items-end gap-3`}>
                <div
                  className={`w-${destinationTypeForm.watch("type") === "location" ? "1/3" : "full"} min-w-[100px]`}
                >
                  <FormField
                    control={destinationTypeForm.control}
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
                {destinationTypeForm.watch("type") == "location" ? (
                  <>
                    <div className="min-w-[200px] sm:w-1/2">
                      <FormField
                        control={destinationTypeForm.control}
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
                      type="submit"
                      disabled={
                        destinationTypeForm.watch("location") === "" ||
                        (!detailsState.error &&
                          destinationTypeForm.watch("location") ===
                            detailsState.url) ||
                        loading
                      }
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <ArrowRight />
                      )}
                    </Button>
                  </>
                ) : null}
              </div>
            </form>
          </Form>

          <Form {...form}>
            {form.watch("type") === "note" ||
            (form.watch("type") === "location" && form.watch("location")) ? (
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
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
                        <FormLabel>Body</FormLabel>
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
                            styleClasses={{
                              input: "w-full sm:max-w-[350px]",
                            }}
                            activeTagIndex={activeTagIndex}
                            setActiveTagIndex={setActiveTagIndex}
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

                <Button
                  type="submit"
                  disabled={
                    createDestination.isPending ||
                    (!form.watch("name") && form.watch("type") === "note") ||
                    (!form.watch("location") &&
                      form.watch("type") === "location")
                  }
                  size="sm"
                >
                  <Plus />
                  {createDestination.isPending ? "Creating..." : "Create"}
                </Button>
              </form>
            ) : null}
          </Form>
        </CardContent>
      </Card>
    </TiltCard>
  );
}

export function RecentDestinations() {
  const recentDestinations = api.destination.getRecent.useQuery()?.data ?? [];

  return (
    <TiltCard>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Recent Destinations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-6">
          {recentDestinations.length > 0 ? (
            recentDestinations.map((dest: Destination) => {
              return <DestinationCard key={dest.id} {...dest} />;
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              🌌 No destinations found. Try creating one and come back!
            </p>
          )}
          <Button size="sm">
            <RefreshCcw />
            Refresh
          </Button>
        </CardContent>
      </Card>
    </TiltCard>
  );
}

export function DestinationCard(props: Destination) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">
          {props.name ?? "Unnamed Destination"}
        </CardTitle>
      </CardHeader>
      <CardContent className="sm:px-3 xl:px-6">
        <p>
          {props.body?.slice(0, 47) +
            (props.body && props.body.length > 47 ? "..." : "")}
        </p>
      </CardContent>
    </Card>
  );
}
