"use client";

import { useActionState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AlertCircle } from "lucide-react";

import {
  verifyEmailAction,
  resendEmailVerificationCodeAction,
} from "~/app/(marketing)/verify-email/actions";
import { logoutAction } from "~/app/(platform)/actions";

import { Button } from "~/components/ui/button";
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

import { toast } from "~/components/hooks/use-toast";

const FormSchema = z.object({
  pin: z
    .string()
    .min(8, {
      message: "Your one-time password must be 8 characters.",
    })
    .max(8, {
      message: "Your one-time password must be 8 characters.",
    }),
});

const emailVerificationInitialState = {
  message: "",
};

export function EmailVerificationForm() {
  const [state, action] = useActionState(
    verifyEmailAction,
    emailVerificationInitialState,
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  return (
    <Form {...form}>
      <form action={action} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="pin"
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

const resendEmailInitialState = {
  message: "",
};

const logoutState = {
  message: "",
};

export function ResendEmailVerificationCodeForm() {
  const [state, action] = useActionState(
    resendEmailVerificationCodeAction,
    resendEmailInitialState,
  );
  useEffect(() => {
    if (state.message.length > 0) {
      toast({
        title: "Notice",
        description: state.message ?? "An error occurred",
      });
    }
  }, [state]);
  const [, outAction] = useActionState(logoutAction, logoutState);
  return (
    <div className="mt-4 flex justify-end space-x-4">
      <form action={action}>
        <Button variant="outline" type="submit">
          Resend code
        </Button>
      </form>
      <form action={outAction}>
        <Button variant="destructive" type="submit">
          Log out
        </Button>
      </form>
    </div>
  );
}
