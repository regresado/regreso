"use client";

import { useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { forgotPasswordAction } from "~/app/(marketing)/forgot-password/actions";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";

import { toast } from "~/components/hooks/use-toast";

const FormSchema = z.object({
  email: z.string().email(),
});

const initialForgotPasswordState = {
  message: "",
};

export function ForgotPasswordForm() {
  const [state, action] = useActionState(
    forgotPasswordAction,
    initialForgotPasswordState,
  );

  useEffect(() => {
    if (state.message.length > 0) {
      toast({
        title: "Notice",
        description: state.message ?? "An error occurred",
      });
    }
  }, [state]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form action={action} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="steve@pelicans.dev"
                  type="email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button variant="default" type="submit">
          Send
        </Button>
        {/* <p>{state.message}</p> */}
      </form>
    </Form>
  );
}
