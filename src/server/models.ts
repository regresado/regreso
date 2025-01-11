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
  lists?: List[];
}

export interface List {
  id: number;
  name: string;
  emoji: string | null;
  description: string | null;
  userId: number;
  createdAt: Date;
  size?: number;
  updatedAt?: Date | null;
  tags?: { id: number; text: string }[];
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

export const listSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "The name must be at least 1 characters.",
    })
    .max(100, {
      message: "The name must be less than 100 characters.",
    }),
  emoji: z.string().min(1).max(5, {
    message: "The emoji must be 1 character.",
  }),
  description: z.string().min(0).max(200, {
    message: "The description must be less than 200 characters.",
  }),
  tags: z.array(z.object({ id: z.string(), text: z.string() })).min(0),
});

export const updateDestinationSchema = z.object({
  id: z.number(),
  ...destinationSchema.shape,
});

export const updateListSchema = z.object({
  id: z.number(),
  newTags: z.array(z.string()).optional(),
  removedTags: z.array(z.string()).optional(),
  name: listSchema.shape.name.optional(),
  emoji: listSchema.shape.emoji.optional(),
  description: listSchema.shape.description.optional(),
  tags: listSchema.shape.tags.optional(),
});

const destinationSearchTypes = ["location", "note", "any"] as const;

export const destinationSearchSchema = z.object({
  type: z.enum(destinationSearchTypes).optional().nullable(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
  order: z.enum(["ASC", "DESC"]).optional(),
  lists: z.array(z.number()).optional(),
  searchString: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  limit: z.number().max(30).optional().default(5),
  offset: z.number().optional().default(0),
});

export const listSearchSchema = z.object({
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "size", "name"]).optional(),
  order: z.enum(["ASC", "DESC"]).optional(),
  searchString: z.string().nullable().optional(),
  onlyFavorites: z.boolean().optional(),
  limit: z.number().optional().default(5),
  offset: z.number().optional().default(0),
});
