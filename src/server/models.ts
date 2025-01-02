import { z } from "zod";

export interface User {
  id: number;
  email: string;
  name: string;
  displayName: string;
  bio: string | null;
  googleId?: string | null;
  githubId?: number | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  registered2FA: boolean;
  registeredPasskey: boolean;
  registeredTOTP: boolean;
  registeredSecurityKey: boolean;
}

export interface SessionFlags {
  twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
  id: string;
  expiresAt: Date;
  userId: number;
}

export interface Destination {
  id: number;
  name: string | null;
  location: string | null;
  type: string;
  userId: number;
  body: string | null;
  attachments?: string[];
  createdAt: Date;
  tags?: { id: number; text: string }[];
  updatedAt: Date | null;
}

const destinationTypes = ["location", "note", "file"] as const;

export const destinationSchema = z.object({
  type: z.enum(destinationTypes),
  location: z.string().nullable(),
  name: z
    .string({
      required_error: "Please select an email to display.",
    })
    .max(100, {
      message: "The name must be less than 100 characters.",
    }),
  body: z
    .string()
    .min(0)
    .max(1000, {
      message: "The body must be less than 1000 characters.",
    })
    .nullable(),
  tags: z.array(z.object({ id: z.string(), text: z.string() })).min(0),
  attachments: z.array(z.string()),
});

export const updateDestinationSchema = z.object({
  id: z.number(),
  ...destinationSchema.shape,
});

export const destinationSearchSchema = z.object({
  type: z.enum(destinationTypes).optional().nullable(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
  order: z.enum(["ASC", "DESC"]).optional(),
  searchString: z.string().nullable().optional(),
  limit: z.number().optional().default(5),
  offset: z.number().optional().default(0),
});
