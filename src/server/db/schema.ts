import { relations, sql, type InferSelectModel } from "drizzle-orm";
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
    aiTaggingInstance: varchar("ai_tagging_instance", { length: 256 }),
    workspaceId: integer("workspace_id")
      .references(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (): any => workspaces.id,
        {
          onDelete: "set default",
          onUpdate: "cascade",
        },
      )
      .default(0),
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
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    code: text("code").notNull(),
    email: text("email").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
);

export const passwordResetSessions = createTable("password_reset_session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
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
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  key: text("key").notNull(),
});

export const passkeyCredentials = createTable("passkey_credential", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  algorithm: integer("algorithm").notNull(),
  publicKey: text("public_key").notNull(),
});

export const securityKeyCredentials = createTable("security_key_credential", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  name: text("name").notNull(),
  algorithm: integer("algorithm").notNull(),
  publicKey: text("public_key").notNull(),
});

export const destinations = createTable(
  "destination",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    location: varchar("location", { length: 256 }),
    type: varchar("type", { length: 256 }).notNull(),
    body: text("body"),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
    workspaceId: integer("workspace_id")
      .references(() => workspaces.id, {
        onDelete: "cascade",
      })
      .notNull(),
    archived: boolean("archived").default(false).notNull(),
  },
  (destination) => ({
    searchIndex: index("destination_search_index").using(
      "gin",
      sql`setweight(to_tsvector('english', ${destination.name}), 'A') ||
          setweight(to_tsvector('english', ${destination.body}), 'B')`,
    ),
    uniqueLocation: unique().on(destination.userId, destination.location),
  }),
);

export const tags = createTable(
  "tag",
  {
    id: serial("id").primaryKey(),
    shortcut: varchar("shortcut", { length: 256 }),
    name: varchar("name", { length: 256 }).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    workspaceId: integer("workspace_id")
      .references(() => workspaces.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
      .$onUpdate(() => new Date()),
    description: varchar("description", { length: 256 }),
    color: varchar("color", { length: 256 }),
    archived: boolean("archived").default(false).notNull(),
  },
  (tag) => ({
    searchIndex: index("tag_search_index").using(
      "gin",
      sql`setweight(to_tsvector('english', ${tag.shortcut}), 'A') ||
          setweight(to_tsvector('english', ${tag.name}), 'B')`,
    ),
    uniqueTagName: unique().on(tag.userId, tag.name),
    uniqueTagShortcut: unique().on(tag.userId, tag.shortcut),
  }),
);

export const destinationTags = createTable(
  "destination_tag",
  {
    id: serial("id").primaryKey(),
    destinationId: integer("destination_id").references(() => destinations.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    tagId: integer("tag_id").references(() => tags.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (destinationTag) => ({
    uniqueTagDestination: unique().on(
      destinationTag.destinationId,
      destinationTag.tagId,
    ),
  }),
);

export const lists = createTable(
  "list",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    emoji: varchar("emoji", { length: 256 }),

    description: varchar("description", { length: 256 }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    workspaceId: integer("workspace_id")
      .references(() => workspaces.id, {
        onDelete: "cascade",
      })
      .notNull(),
    archived: boolean("archived").default(false).notNull(),
  },
  (list) => ({
    uniqueListName: unique().on(list.userId, list.name),
    searchIndex: index("list_search_index").using(
      "gin",
      sql`setweight(to_tsvector('english', ${list.name}), 'A') ||
            setweight(to_tsvector('english', ${list.description}), 'B')`,
    ),
  }),
);

export const listTags = createTable(
  "list_tag",
  {
    id: serial("id").primaryKey(),
    listId: integer("list_id").references(() => lists.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    tagId: integer("tag_id").references(() => tags.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (listTag) => ({
    uniqueListTag: unique().on(listTag.listId, listTag.tagId),
  }),
);

export const destinationLists = createTable(
  "destination_list",
  {
    id: serial("id").primaryKey(),
    destinationId: integer("destination_id").references(() => destinations.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    listId: integer("list_id").references(() => lists.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (destinationList) => ({
    uniqueDestinationList: unique().on(
      destinationList.destinationId,
      destinationList.listId,
    ),
  }),
);

export const workspaces = createTable(
  "workspace",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    emoji: varchar("emoji", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    userId: integer("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    archived: boolean("archived").default(false).notNull(),
  },
  (workspace) => ({
    uniqueWorkspaceName: unique().on(workspace.userId, workspace.name),
    searchIndex: index("workspace_searc_index").using(
      "gin",
      sql`setweight(to_tsvector('english', ${workspace.name}), 'A') ||
            setweight(to_tsvector('english', ${workspace.description}), 'B')`,
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

export const destinationTagsRelations = relations(
  destinationTags,
  ({ one }) => ({
    destination: one(destinations, {
      fields: [destinationTags.destinationId],
      references: [destinations.id],
    }),
    tag: one(tags, {
      fields: [destinationTags.tagId],
      references: [tags.id],
    }),
  }),
);

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [tags.workspaceId],
    references: [workspaces.id],
  }),
  destinationTags: many(destinationTags),
  listTags: many(listTags),
}));

export const destinationsRelations = relations(
  destinations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [destinations.userId],
      references: [users.id],
    }),
    workspace: one(workspaces, {
      fields: [destinations.workspaceId],
      references: [workspaces.id],
    }),
    destinationTags: many(destinationTags),
  }),
);

export const listsRelations = relations(lists, ({ one, many }) => ({
  tags: many(listTags),
  destinations: many(destinationLists),
  user: one(users, {
    fields: [lists.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [lists.workspaceId],
    references: [workspaces.id],
  }),
}));

export const listTagsRelations = relations(listTags, ({ one }) => ({
  list: one(lists, {
    fields: [listTags.listId],
    references: [lists.id],
  }),
  tag: one(tags, {
    fields: [listTags.tagId],
    references: [tags.id],
  }),
}));

export const destinationListsRelations = relations(
  destinationLists,
  ({ one }) => ({
    destination: one(destinations, {
      fields: [destinationLists.destinationId],
      references: [destinations.id],
    }),
    list: one(lists, {
      fields: [destinationLists.listId],
      references: [lists.id],
    }),
  }),
);
