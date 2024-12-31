import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

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
    recoveryCode: varchar("recovery_code").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio").default("Pelicans are epic"),
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

export const emailVerificationRequests = createTable(
  "email_verification_request",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    code: text("code").notNull(),
    email: text("email").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
);

export const passwordResetSessions = createTable("password_reset_session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  code: text("code").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  twoFactorVerified: boolean("two_factor_verified").default(false).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const totpCredentials = createTable("totp_credential", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  key: text("key").notNull(),
});

export const passkeyCredentials = createTable("passkey_credential", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  algorithm: integer("algorithm").notNull(),
  publicKey: text("public_key").notNull(),
});

export const securityKeyCredentials = createTable("security_key_credential", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  algorithm: integer("algorithm").notNull(),
  publicKey: text("public_key").notNull(),
});

export const destinations = createTable("destination", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  location: varchar("location", { length: 256 }).unique(),
  type: varchar("type", { length: 256 }).notNull(),
  body: text("body"),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => new Date()),
});

export const tags = createTable("tag", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  displayName: varchar("display_name", { length: 256 }),
  userId: integer("user_id").references(() => users.id),
});

export const destinationTags = createTable(
  "destination_tag",
  {
    destinationId: integer("destination_id").references(() => destinations.id),
    tagId: integer("tag_id").references(() => tags.id),
  },
  (destinationTag) => ({
    uniqueTagDestination: unique().on(
      destinationTag.destinationId,
      destinationTag.tagId,
    ),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  passwordResetSessions: many(passwordResetSessions),
  securityKeyCredentials: many(securityKeyCredentials),
  totpCredentials: many(totpCredentials),
  passkeyCredentials: many(passkeyCredentials),
}));

export const passwordResetSessionsRelations = relations(
  passwordResetSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetSessions.userId],
      references: [users.id],
    }),
  }),
);

export const securityKeyCredentialsRelations = relations(
  securityKeyCredentials,
  ({ one }) => ({
    user: one(users, {
      fields: [securityKeyCredentials.userId],
      references: [users.id],
    }),
  }),
);

export const totpCredentialsRelations = relations(
  totpCredentials,
  ({ one }) => ({
    user: one(users, {
      fields: [totpCredentials.userId],
      references: [users.id],
    }),
  }),
);

export const passkeyCredentialsRelations = relations(
  passkeyCredentials,
  ({ one }) => ({
    user: one(users, {
      fields: [passkeyCredentials.userId],
      references: [users.id],
    }),
  }),
);
