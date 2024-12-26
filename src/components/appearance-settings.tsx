"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useTheme } from "next-themes";

import type { User } from "~/server/models";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
  FormField,
  FormDescription,
} from "~/components/ui/form";
import { Badge } from "~/components/ui/badge";

const uiModes = ["light", "dark", "system"] as const;
const uiThemes = ["default"] as const;

const FormSchema = z.object({
  mode: z.enum(uiModes),
  theme: z.enum(uiThemes),
});

export default function AppearanceSettings(_props: { user: User }) {
  const { setTheme, theme } = useTheme();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mode: theme as (typeof uiModes)[number],
      theme: "default",
    },
  });

  const mode = form.watch("mode");

  React.useEffect(() => {
    setTheme(mode);
  }, [mode, setTheme]);

  return (
    <div className="space-y-6 px-3">
      <Form {...form}>
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>UI Mode</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                UI Theme{" "}
                <Badge variant="secondary" className="ml-2">
                  Soon!
                </Badge>
              </FormLabel>
              <FormDescription>
                This preset or custom theme will apply everywhere.
              </FormDescription>
              <FormControl>
                <Select
                  disabled
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="default">Regreso</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
}
