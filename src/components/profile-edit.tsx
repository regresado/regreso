"use client";

import { useState, useActionState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { User } from "~/server/models";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Form, FormLabel, FormControl, FormItem } from "~/components/ui/form";
import { UploadButton } from "~/lib/client/uploadthing";

import { toast } from "~/components/hooks/use-toast";

import { updateProfileAction } from "~/app/(platform)/dashboard/settings/profile/actions";

const FormSchema = z.object({
  displayName: z
    .string()
    .min(1, {
      message: "Display name must be at least 2 characters.",
    })
    .max(50, {
      message: "Display name must be at most 50 characters.",
    }),
  bio: z.string().max(160, {
    message: "Bio must be at most 160 characters.",
  }),
});

const initialState = {
  message: "",
};

export default function ProfileEdit(props: { user: User }) {
  const [displayName, setDisplayName] = useState(props.user.displayName);
  const [bio, setBio] = useState(
    "I'm a software developer who loves creating user-friendly interfaces.",
  );
  const [avatarUrl, setAvatarUrl] = useState(
    "/placeholder.svg?height=100&width=100",
  );

  const [, action] = useActionState(updateProfileAction, initialState);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      displayName: "",
      bio: "",
    },
  });
  const {
    trigger,
    formState: { isValid },
  } = form;

  return (
    <>
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
          className="flex w-full flex-col gap-6"
        >
          <FormItem className="w-full">
            <FormLabel>Profile Picture</FormLabel>
            <FormControl>
              <UploadButton
                className="rounded px-4 py-2 font-bold text-white"
                endpoint="profilePicture"
                onClientUploadComplete={(res) => {
                  console.log("Files", res);
                  alert("Files uploaded");
                  toast({
                    title: "Upload complete.",
                    description: "Your file was successfully uploaded!",
                  });
                  if (res[0]) {
                    setAvatarUrl(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </FormControl>
          </FormItem>
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setBio(e.target.value)
          }
          rows={3}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{displayName}</h4>
              <p className="text-sm text-muted-foreground">{bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
