"use client";

import { useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AlertCircle } from "lucide-react";

import { resetPasswordAction } from "~/app/(marketing)/reset-password/actions";
import { verifyPasswordResetEmailAction } from "~/app/(marketing)/reset-password/verify-email/actions";

const initialPasswordResetEmailVerificationState = {
  message: "",
};

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "~/components/ui/input-otp";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

import { logoutAction } from "~/app/(platform)/actions";

import { toast } from "~/components/hooks/use-toast";

const VerifyEmailFormSchema = z.object({
  code: z
    .string()
    .min(8, {
      message: "Your one-time password must be 8 characters.",
    })
    .max(8, {
      message: "Your one-time password must be 8 characters.",
    }),
});

const FormSchema = z.object({
  password: z.string(),
});

const initialPasswordResetState = {
  message: "",
};
const logoutState = {
  message: "",
};

export function PasswordResetForm() {
  const [state, action] = useActionState(
    resetPasswordAction,
    initialPasswordResetState,
  );
  const [, outAction] = useActionState(logoutAction, logoutState);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });
  const {
    trigger,
    formState: { isValid },
  } = form;

  return (
    <Form {...form}>
      <form
        action={action}
        onSubmit={async (e) => {
          if (!isValid) {
            e.preventDefault();
            await trigger();
            return;
          }
          e.currentTarget?.requestSubmit();
        }}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                New password must be at least 8 characters.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button>Reset password</Button>
        <div className="mt-4 flex justify-end space-x-4">
          <form action={outAction} className="mt-4">
            <Button variant="destructive" type="submit">
              Log out
            </Button>
          </form>
        </div>
        {state.message.length > 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {state.message ?? "An error occurred"}
            </AlertDescription>
          </Alert>
        ) : null}
      </form>
    </Form>
  );
}

export function PasswordResetEmailVerificationForm() {
  const [state, action] = useActionState(
    verifyPasswordResetEmailAction,
    initialPasswordResetEmailVerificationState,
  );

  const form = useForm<z.infer<typeof VerifyEmailFormSchema>>({
    resolver: zodResolver(VerifyEmailFormSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (state.message.length > 0) {
      toast({
        title: "Notice",
        description: state.message ?? "An error occurred",
      });
    }
  }, [state]);

  return (
    <Form {...form}>
      <form
        action={action}
        onSubmit={async (e) => {
          if (!form.formState.isValid) {
            e.preventDefault();
            await form.trigger();
            return;
          }
          e.currentTarget?.requestSubmit();
        }}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={8} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
        {state.message.length > 0 ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {state.message ?? "An error occurred"}
            </AlertDescription>
          </Alert>
        ) : null}
      </form>
    </Form>
  );
}
