"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { TagInput, type Tag } from "emblor";
import { Loader2, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { destinationSearchSchema, type Destination } from "~/server/models";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { DestinationCard } from "../_components/destination";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [tags, setTags] = useState<Tag[]>(
    searchParams.get("tags") && searchParams.get("tags")!.split(",").length > 0
      ? searchParams
          .get("tags")!
          .split(",")
          .map(
            (tag) =>
              ({
                text: tag,
                id: Math.floor(Math.random() * 1000000000).toString(),
              }) as Tag,
          )
      : [],
  );
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  function updateUrl(data: z.infer<typeof destinationSearchSchema>) {
    const newParams = [
      ["type", data.type ?? null],
      ["search", data.searchString],
      ["sortBy", data.sortBy],
      ["order", data.order],
      ["tags", data.tags ? data.tags.join(",") : ""],
    ];

    return newParams
      .filter((i) => i != null)
      .map(([key, value]) => key + "=" + value)
      .join("&");
  }

  const form = useForm<z.infer<typeof destinationSearchSchema>>({
    resolver: zodResolver(destinationSearchSchema),
    defaultValues: {
      type:
        (searchParams.get("type") as unknown as z.infer<
          typeof destinationSearchSchema
        >["type"]) ?? null,
      tags:
        searchParams.get("tags") &&
        searchParams.get("tags")!.split(",").length > 0
          ? searchParams.get("tags")!.split(",")
          : [],
      sortBy:
        (searchParams.get("createdAt") as unknown as z.infer<
          typeof destinationSearchSchema
        >["sortBy"]) ?? "createdAt",
      order:
        (searchParams.get("order") as unknown as z.infer<
          typeof destinationSearchSchema
        >["order"]) ?? "DESC",
      searchString: searchParams.get("search") ?? "",
    },
  });

  const [submitValues, setSubmitValues] = useState(form.getValues());

  const {
    data: searchResults = [],
    refetch,
    isFetching,
  } = api.destination.getMany.useQuery({
    ...submitValues,
    limit: 6,
  });

  function onSubmit(data: z.infer<typeof destinationSearchSchema>) {
    setSubmitValues(data);
    router.push(pathname + "?" + updateUrl(data));
    void refetch();
  }

  return (
    <div className="grid grid-cols-1 p-4 space-y-4">
      <h1>Destination Search</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="lg:gap-3  flex-col flex items-center space-y-4 lg:space-y-0 flex-grow">
            <div className=" flex flex-row space-x-3 flex-grow w-full">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-2 space-y-0">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[120px] space-between">
                          <SelectValue placeholder="Any Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          <SelectItem value="location">Location</SelectItem>
                          <SelectItem value="note">Note</SelectItem>
                          <SelectItem value="file" disabled>
                            File
                            <Badge variant="secondary" className="ml-2">
                              Soon!
                            </Badge>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {form.watch("type") && (
                      <Button
                        variant="outline"
                        className="m-0"
                        size="icon"
                        onClick={() => {
                          form.setValue("type", null);
                        }}
                      >
                        <X className="w-4" />
                      </Button>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="searchString"
                render={({ field }) => (
                  <FormControl>
                    <Input
                      placeholder="Search with text..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormControl>
                  <TagInput
                    {...field}
                    placeholder="Search with tags..."
                    tags={tags}
                    className="sm:min-w-[450px]"
                    setTags={(newTags) => {
                      setTags(newTags);
                      form.setValue(
                        "tags",
                        (newTags as [Tag, ...Tag[]]).map(
                          (tag: Tag) => tag.text,
                        ),
                        { shouldDirty: true },
                      );
                    }}
                    styleClasses={{
                      input: "w-full sm:max-w-[350px]",
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                  />
                </FormControl>
              )}
            />
          </div>
          <div className="flex space-x-2 justify-end">
            <FormField
              control={form.control}
              name="sortBy"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort by</SelectLabel>

                      <SelectItem value="createdAt">Created At</SelectItem>
                      <SelectItem value="updatedAt">Updated At</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Direction</SelectLabel>

                      <SelectItem value="ASC">Ascending</SelectItem>
                      <SelectItem value="DESC">Descending</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <Button
              type="submit"
              className="lg:w-1/4 w-full"
              disabled={isFetching || !form.formState.isDirty}
            >
              {isFetching ? <Loader2 className="animate-spin" /> : <Search />}
              Search
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex flex-col space-y-4">
        <p className="font-regular text-sm">Search results:</p>
        {searchResults.length > 0 ? (
          searchResults.map((dest: Destination) => {
            return <DestinationCard key={dest.id} {...dest} />;
          })
        ) : isFetching ? (
          <p className="justify-center text-sm text-muted-foreground">
            🔍 Searching...
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            🌌 No destinations found. Try creating one and come back!
          </p>
        )}
      </div>
      {/* <div className="flex space-x-2 justify-center">
        <Button size="sm" variant="secondary" disabled={isFetching} asChild>
          <Link href="/pins">
            <Ellipsis />
            View more
          </Link>
        </Button>
      </div>
    </div>*/}
    </div>
  );
}
