// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm/sql";
import {
  index,
  serial,
  text,
  integer,
  boolean,
  varchar,
  pgTableCreator,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `regreso_${name}`);

export const users = createTable(
  "user",
  {
    id: serial("id").primaryKey(),
    googleId: text("google_id").unique(),
    githubId: integer("github_id").unique(),
    email: text("email").unique().notNull(),
    displayName: text("display_name").default("Anonymous").notNull(),
    name: varchar("name", { length: 32 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 256 }),
    emailVerified: boolean("email_verified").default(false).notNull(),
    totpKey: varchar("totp_code"),
    recoveryCode: varchar("recovery_code").notNull(),
  },
  (user) => ({
    emailIndex: index("email_index").on(user.email),
    googleIdIndex: index("google_id_index").on(user.googleId),
    githubIdIndex: index("github_id_index").on(user.githubId),
  }),
);

export const sessions = createTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  twoFactorVerified: boolean("two_factor_verified").default(false).notNull(),
});

export type UserSchema = InferSelectModel<typeof users>;
export type SessionSchema = InferSelectModel<typeof sessions>;

export interface SessionFlags {
  twoFactorVerified: boolean;
}

export const destinations = createTable("post", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }),
  location: varchar("location", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const posts = createTable(
  "destination",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const emailVerificationRequests = createTable(
  "email_verification_request",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    code: text("code").notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
);
