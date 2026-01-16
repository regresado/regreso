"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { User } from "~/server/models";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Input
} from "~/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { BotIcon, RotateCcw } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

import {
  updateAdvancedAction,
} from "~/app/(platform)/settings/advanced/actions";
import { Button } from "./ui/button";


const FormSchema = z.object({
  enabled: z.boolean(),
  instance: z.string().url().optional(),
});

const initialState = {
  message: "",
};

export default function AdvancedSettings(props: { user: User }) {
  const [, action] = React.useActionState(updateAdvancedAction, initialState);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: (props.user.aiTaggingInstance != null && props.user.aiTaggingInstance.length > 0) ?? false,
      instance: (props.user.aiTaggingInstance != null && props.user.aiTaggingInstance.length > 0) ? props.user.aiTaggingInstance : "https://ai.hackclub.com",
    },
  });

  return (
    <div className="space-y-6 px-3">
      <Alert>
        <BotIcon />
        <AlertTitle>
          Hey there!
        </AlertTitle>
        <AlertDescription>
          We understand that <del>clankers</del> <i>generative AI</i> offer both convience
          and pitfalls. That's why Regreso offerrs thoughtful, <b>opt-in</b> AI features
          which give you maximum control. Use our default instance or provide your own.
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form action={action}
          className="flex w-full flex-col gap-6">

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="w-full">

                <FormControl>
                  <Switch id="ai-tagging-enabled" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="ml-2" htmlFor="ai-tagging-enabled">Enable AI Tagging</FormLabel>

                <FormMessage />

              </FormItem>
            )}
          />
          {form.watch("enabled") && (
            <FormField
              control={form.control}
              name="instance"
              render={({ field }) => (

                <FormItem className="w-full">
                  <FormLabel>AI Tagging Instance</FormLabel>

                  <FormControl>
                    <div className="flex flex-row items-center space-x-2 mb-1">
                      <Input placeholder="https://ai.hackclub.com" value={field.value} onChange={field.onChange} />
                      <Button variant="ghost" size="sm" onClick={() => { field.onChange("https://ai.hackclub.com"); }}>
                        <RotateCcw />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />

                </FormItem>
              )}
            />
          )}
          <Button type="submit">Save Settings</Button>
        </form>

      </Form>
    </div>
  );
}
