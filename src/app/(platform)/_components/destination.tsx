"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { EditorContent, useEditor } from "@tiptap/react";
import { TRPCClientErrorLike } from "@trpc/client";
import { UseTRPCMutationResult } from "@trpc/react-query/shared";
import { api } from "~/trpc/react";
import { TagInput, type Tag } from "emblor";
import {
  ArrowRight,
  ExternalLink,
  Loader2,
  MapPin,
  MapPinPlus,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { destinationSchema, type Destination } from "~/server/models";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/hooks/use-toast";
import { MinimalTiptapEditor } from "~/components/minimal-tiptap";
import { createExtensions } from "~/components/minimal-tiptap/hooks/use-minimal-tiptap";
import { TiltCard } from "~/components/tilt-card";

import { getWebDetailsAction } from "~/app/(platform)/dashboard/actions";

const destinationTypes = ["location", "note", "file"] as const;

const destinationSchema2 = z.object({
  id: z.number(),
  ...destinationSchema.shape,
});
const destinationTypeSchema = z.object({
  type: z.enum(destinationTypes),
  location: z
    .string()
    .regex(
      new RegExp(
        /(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
      ),
      "Please enter a valid URL",
    ),
});

type DestinationFormProps =
  | {
      destinationMutation: (callback?: () => void) => UseTRPCMutationResult<
        { success: boolean },
        TRPCClientErrorLike<{
          input: z.infer<typeof destinationSchema2>;
          output: { success: boolean };
          transformer: true;
          errorShape: { message: string };
        }>,
        z.infer<typeof destinationSchema2>,
        unknown
      >;
      update: true;
      updateId: number;
      defaultValues?: z.infer<typeof destinationSchema>;
    }
  | {
      destinationMutation: (callback?: () => void) => UseTRPCMutationResult<
        { success: boolean },
        TRPCClientErrorLike<{
          input: z.infer<typeof destinationSchema>;
          output: { success: boolean };
          transformer: true;
          errorShape: { message: string };
        }>,
        z.infer<typeof destinationSchema>,
        unknown
      >;
      update: false;
      defaultValues?: z.infer<typeof destinationSchema>;
    };
function DestinationForm(props: DestinationFormProps) {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(props.update ? true : false);

  const [tags, setTags] = useState<Tag[]>([]);

  const [detailsState, action] = useActionState(getWebDetailsAction, {
    error: "",
    url: undefined,
    title: [undefined],
    description: [undefined],
  });

  const destinationTypeForm = useForm<z.infer<typeof destinationTypeSchema>>({
    resolver: zodResolver(destinationTypeSchema),

    defaultValues: {
      type: (props.defaultValues?.type as "note" | "location") ?? "location",
      location: props.defaultValues?.location ?? "",
    },
  });

  const form = useForm<z.infer<typeof destinationSchema>>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      type: "location",
      location: props.defaultValues?.location ?? null,
      name: props.defaultValues?.name ?? "hi",
      body: props.defaultValues?.body ?? "",
      tags: props.defaultValues?.tags ?? [],
      attachments: [],
    },
  });

  useEffect(() => {
    form.reset({
      type: "location",
      location: props.defaultValues?.location ?? null,
      name: props.defaultValues?.name ?? "",
      body: props.defaultValues?.body ?? "",
      tags: props.defaultValues?.tags ?? [],
      attachments: [],
    });
    setLoading2(false);
  }, [props.defaultValues]);

  useEffect(() => {
    if (!detailsState.error) {
      const names = detailsState.title.filter(String);
      const descriptions = detailsState.description.filter(String);
      form.setValue("name", names[0] ?? "");
      form.setValue("body", `<p class="text-node">${descriptions[0]}</p>`);
    }
    if (detailsState.url) {
      form.setValue(
        "location",
        detailsState.url ?? destinationTypeForm.watch("location"),
      );
      destinationTypeForm.setValue(
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
    setTags([]);

    if (destinationTypeForm.watch("type") === "note") {
      form.reset({
        type: "note",
        location: null,
        name: props.defaultValues?.name ?? "",
        body: props.defaultValues?.body ?? "",
        tags: props.defaultValues?.tags ?? [],
        attachments: [],
      });
      setTags(props.defaultValues?.tags ?? []);
      setLoading(false);
      setLoading2(false);
    }
  }, [type, destinationTypeForm, form]);

  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const {
    trigger,
    formState: { isValid },
  } = form;

  function onSubmit(data: z.infer<typeof destinationSchema>) {
    if (props.update) {
      if (!props.updateId) {
        return;
      }
      submitMutation.mutate({ ...data, id: props.updateId });
    } else {
      submitMutation.mutate({ ...data, id: 0 });
    }
  }

  const submitMutation = props.destinationMutation(() => {
    form.reset();
    setTags([]);
    destinationTypeForm.reset();
  });

  const {
    trigger: triggerDestinationTypeForm,
    formState: { isValid: isDestinationTypeValid },
  } = destinationTypeForm;

  return (
    <>
      <Form {...destinationTypeForm}>
        <form
          action={action}
          onSubmit={async (e) => {
            if (!isDestinationTypeValid) {
              e.preventDefault();
              await triggerDestinationTypeForm();
              return;
            }
            setLoading(true);
            form.reset();
            setTags([]);

            e.currentTarget?.requestSubmit();
          }}
          className="overflow-y-auto"
        >
          <div
            className={`flex w-full flex-row flex-wrap items-end gap-3 overflow-y-auto`}
          >
            <div
              className={`w-${destinationTypeForm.watch("type") === "location" ? "1/3" : "full"} min-w-[100px] `}
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
                    destinationTypeForm.watch("location") ===
                      form.watch("location") ||
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
      {JSON.stringify(loading2)}
      <Form {...form}>
        {((!loading && destinationTypeForm.watch("type") === "note") ||
          (form.watch("type") === "location" && form.watch("location")) ||
          props.update) &&
        !loading2 ? (
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
                submitMutation.isPending ||
                (!form.watch("name") && form.watch("type") === "note") ||
                (form.watch("type") === "location" &&
                  (!form.watch("location") ||
                    destinationTypeForm.watch("location") !=
                      form.watch("location")))
              }
              size="sm"
            >
              {props.update ? (
                <>
                  {submitMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Pencil />
                  )}

                  {submitMutation.isPending
                    ? "Updating Destination..."
                    : "Update Destination"}
                </>
              ) : (
                <>
                  {submitMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Plus />
                  )}

                  {submitMutation.isPending
                    ? "Creating Destination..."
                    : "Create Destination"}
                </>
              )}
            </Button>
          </form>
        ) : null}
      </Form>
    </>
  );
}

export function CreateDestination() {
  const utils = api.useUtils();
  const createDestination = (callback?: () => void) =>
    api.destination.create.useMutation({
      onSuccess: async () => {
        await utils.destination.invalidate();
        if (typeof callback === "function") {
          callback();
        }
      },
      onError: (error) => {
        toast({
          title: "Failed to create destination",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  return (
    <TiltCard>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPinPlus className="mr-2 h-5 w-5" /> Create Destination
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          <DestinationForm
            update={false}
            destinationMutation={createDestination}
          />
        </CardContent>
      </Card>
    </TiltCard>
  );
}

export function RecentDestinations() {
  const {
    data: recentDestinations = [],
    refetch,
    isFetching,
  } = api.destination.getMany.useQuery({
    limit: 3,
  });

  return (
    <TiltCard>
      <Card>
        <CardHeader>
          <Link href="/pins">
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" /> Recent Destinations
            </CardTitle>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          {recentDestinations.length > 0 ? (
            recentDestinations.map((dest: Destination) => {
              return <DestinationCard key={dest.id} {...dest} />;
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              🌌 No destinations found. Try creating one and come back!
            </p>
          )}
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" disabled={isFetching} asChild>
              <Link href="/pins">
                <ExternalLink />
                View All
              </Link>
            </Button>
            <Button
              size="sm"
              disabled={isFetching}
              onClick={() => {
                void refetch();
              }}
            >
              <RefreshCw className={isFetching ? "animate-spin" : undefined} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}

export function DestinationCard(props: Destination) {
  return (
    <Card>
      <CardHeader className="px-3 pt-4 pb-2 text-sm">
        <CardTitle className="truncate">
          <Link href={`/pin/${props.id}`}>
            {props.name ?? "Unnamed Destination"}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0 text-sm ">
        {props.type == "location" ? (
          <p className="truncate text-xs">
            <Button variant="link" asChild className="p-0 truncate">
              <Link
                href={props.location ?? "#"}
                className="text-primary-foreground truncate"
              >
                {props.location}
              </Link>
            </Button>
          </p>
        ) : null}
        <DestinationDialogRender data={props} />
        {props.tags && props.tags?.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-2">
            {props.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.text}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function DestinationDialogRender(props: { data?: Destination }) {
  const editor = useEditor({
    extensions: createExtensions(""),
    editable: false,
    content: props.data?.body ?? "howdy",
  });
  return <EditorContent editor={editor} />;
}

export function DestinationDialog(props: { id: string }) {
  const utils = api.useUtils();

  const router = useRouter();
  const destinationId = props.id;
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);

  const updateDestination = (callback?: () => void) =>
    api.destination.update.useMutation({
      onSuccess: async () => {
        await utils.destination.invalidate();
        if (typeof callback === "function") {
          callback();
          router.push("/dashboard");
        }
      },
      onError: (error) => {
        toast({
          title: "Failed to update destination",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const { data }: { data: Destination | undefined } =
    api.destination.get.useQuery(
      { id: parseInt(destinationId ?? "0", 10) },
      { enabled: !!destinationId },
    );

  function handleOpenChange(openStatus: boolean) {
    setOpen(openStatus);
    if (!openStatus) {
      router.push("/dashboard");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-y-auto md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? "Update Destination"
              : data
                ? data.name
                : "Couldn't find Destination"}
          </DialogTitle>
        </DialogHeader>
        {/* {JSON.stringify({
          ...(data as Destination),
          name: data.name ?? "",
          type: data.type as "location" | "note" | "file",
          attachments: [],
          tags:
            data.tags?.map((tag) => ({
              id: tag.id.toString(),
              text: tag.text,
            })) ?? [],
        })} */}
        {editing &&
        data != undefined &&
        (data.name != undefined || data.location != undefined) ? (
          <DestinationForm
            update={true}
            defaultValues={{
              ...(data as Destination),
              name: data.name ?? "",
              type: data.type as "location" | "note" | "file",
              attachments: [],
              tags:
                data.tags?.map((tag) => ({
                  id: tag.id.toString(),
                  text: tag.text,
                })) ?? [],
            }}
            updateId={parseInt(props.id)}
            destinationMutation={updateDestination}
          />
        ) : (
          <main className="pt-0 flex h-[480px] flex-1 flex-col space-y-6 ">
            {data?.type === "location" ? (
              <p className="truncate text-sm">
                <>
                  Location:{" "}
                  <Button variant="link" asChild className="p-0 truncate ">
                    <Link
                      href={data?.location ?? "#"}
                      className="text-primary-foreground truncate"
                    >
                      {data?.location}
                    </Link>
                  </Button>
                </>
              </p>
            ) : null}
            {data?.body ? (
              <DestinationDialogRender
                data={
                  data?.id !== undefined ? (data as Destination) : undefined
                }
              />
            ) : null}
            {data?.tags && data?.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                Tags:{" "}
                {data?.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.text}
                  </Badge>
                ))}
              </div>
            ) : null}
            {data != undefined ? (
              <Button
                className="mt-4"
                size="sm"
                onClick={() => {
                  setEditing(true);
                }}
              >
                Update Destination
              </Button>
            ) : null}
          </main>
        )}
      </DialogContent>
    </Dialog>
  );
}
