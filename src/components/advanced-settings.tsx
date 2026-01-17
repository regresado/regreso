"use client";

import { useActionState } from "react";
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

import {
  updateAdvancedAction,
} from "~/app/(platform)/settings/advanced/actions";
import { Button } from "./ui/button";


const FormSchema = z.object({
  enabled: z.boolean(),
  instance: z.string().url().optional(),
  hey: z.string()
});

const initialState = {
  message: "",
};

export default function AdvancedSettings(props: { user: User }) {
  const [, action] = useActionState(updateAdvancedAction, initialState);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enabled: (props.user.aiTaggingInstance != null && props.user.aiTaggingInstance.length > 0) ? true :false,
      instance: (props.user.aiTaggingInstance != null && props.user.aiTaggingInstance.length > 0) ? props.user.aiTaggingInstance : "https://ai.hackclub.com",
      hey: "hi"
    },
  });

  const {
    trigger,
    formState: { isValid },
  } = form;
  return (
    <div className="space-y-6 px-3">
      <Alert>
        <BotIcon />
        <AlertTitle>
          Hey there, human!
        </AlertTitle>
        <AlertDescription>
          We understand that <del>clankers</del> <i>generative AI</i> offers both convience
          and pitfalls. That&apos;s why Regreso offerrs thoughtful, <b>opt-in</b> AI features
          which give you maximum control. Use our default AI instance or provide your own.
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form
        action={action}
          onSubmit={async (e) => {
                          console.log(form.getValues())

            if (!isValid) {
              e.preventDefault();
              await trigger();
              return;
            }
            e.currentTarget.requestSubmit();
          }}
          className="flex w-full flex-col gap-6">

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="w-full">

                <FormControl>
                  <Switch id="ai-tagging-enabled" checked={field.value} onCheckedChange={(ch) => {
                    field.onChange(ch);
                    if (ch) {
                      form.setValue("instance", "https://ai.hackclub.com");
                    }
                    else {
                      form.setValue("instance", "");
                    }
                  }} defaultChecked={props.user.aiTaggingInstance != null && props.user.aiTaggingInstance.length > 0} />
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
                      <Input placeholder="https://ai.hackclub.com" {...field} />
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
