import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

export const promptFolders = sqliteTable(
  "prompt_folder",
  (d) => ({
    id: d
      .text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.text("name", { length: 255 }).notNull(),
    icon: d.text("icon", { length: 255 }).notNull(),
    createdById: d
      .text("created_by_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("prompt_folder_created_by_idx").on(t.createdById),
    index("prompt_folder_name_idx").on(t.name),
  ],
);

export const promptFoldersRelations = relations(
  promptFolders,
  ({ many, one }) => ({
    prompts: many(prompts),
    createdBy: one(user, {
      fields: [promptFolders.createdById],
      references: [user.id],
    }),
  }),
);

export const prompts = sqliteTable(
  "prompt",
  (d) => ({
    id: d
      .text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    folderId: d
      .text("folder_id", { length: 255 })
      .notNull()
      .references(() => promptFolders.id, { onDelete: "cascade" }),
    title: d.text("title", { length: 255 }).notNull(),
    promptText: d.text("prompt_text").notNull(),
    model: d.text("model", { length: 255 }).notNull(),
    imageUrl: d.text("image_url", { length: 255 }),
    createdById: d
      .text("created_by_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("prompt_folder_id_idx").on(t.folderId),
    index("prompt_created_by_idx").on(t.createdById),
    index("prompt_title_idx").on(t.title),
  ],
);

export const promptsRelations = relations(prompts, ({ one }) => ({
  folder: one(promptFolders, {
    fields: [prompts.folderId],
    references: [promptFolders.id],
  }),
  createdBy: one(user, {
    fields: [prompts.createdById],
    references: [user.id],
  }),
}));

export const linkFolders = sqliteTable(
  "link_folder",
  (d) => ({
    id: d
      .text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.text("name", { length: 255 }).notNull(),
    icon: d.text("icon", { length: 255 }).notNull(),
    createdById: d
      .text("created_by_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("link_folder_created_by_idx").on(t.createdById),
    index("link_folder_name_idx").on(t.name),
  ],
);

export const linkFoldersRelations = relations(linkFolders, ({ many, one }) => ({
  links: many(links),
  createdBy: one(user, {
    fields: [linkFolders.createdById],
    references: [user.id],
  }),
}));

export const links = sqliteTable(
  "link",
  (d) => ({
    id: d
      .text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    folderId: d
      .text("folder_id", { length: 255 })
      .notNull()
      .references(() => linkFolders.id, { onDelete: "cascade" }),
    title: d.text("title", { length: 255 }).notNull(),
    url: d.text("url", { length: 2048 }).notNull(),
    description: d.text("description"),
    createdById: d
      .text("created_by_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("link_folder_id_idx").on(t.folderId),
    index("link_created_by_idx").on(t.createdById),
    index("link_title_idx").on(t.title),
  ],
);

export const linksRelations = relations(links, ({ one }) => ({
  folder: one(linkFolders, {
    fields: [links.folderId],
    references: [linkFolders.id],
  }),
  createdBy: one(user, {
    fields: [links.createdById],
    references: [user.id],
  }),
}));

// Better Auth core tables
export const user = sqliteTable("user", (d) => ({
  id: d
    .text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text("name", { length: 255 }),
  email: d.text("email", { length: 255 }).notNull().unique(),
  emailVerified: d
    .integer("email_verified", { mode: "boolean" })
    .default(false),
  image: d.text("image", { length: 255 }),
  createdAt: d
    .integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: d
    .integer("updated_at", { mode: "timestamp" })
    .$onUpdate(() => new Date()),
}));

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  linkFolders: many(linkFolders),
  links: many(links),
  promptFolders: many(promptFolders),
  prompts: many(prompts),
  session: many(session),
}));

export const account = sqliteTable(
  "account",
  (d) => ({
    id: d
      .text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .text("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    accountId: d.text("account_id", { length: 255 }).notNull(),
    providerId: d.text("provider_id", { length: 255 }).notNull(),
    accessToken: d.text("access_token"),
    refreshToken: d.text("refresh_token"),
    accessTokenExpiresAt: d.integer("access_token_expires_at", {
      mode: "timestamp",
    }),
    refreshTokenExpiresAt: d.integer("refresh_token_expires_at", {
      mode: "timestamp",
    }),
    scope: d.text("scope", { length: 255 }),
    idToken: d.text("id_token"),
    password: d.text("password"),
    createdAt: d
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const session = sqliteTable(
  "session",
  (d) => ({
    id: d
      .text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .text("user_id", { length: 255 })
      .notNull()
      .references(() => user.id),
    token: d.text("token", { length: 255 }).notNull().unique(),
    expiresAt: d.integer("expires_at", { mode: "timestamp" }).notNull(),
    ipAddress: d.text("ip_address", { length: 255 }),
    userAgent: d.text("user_agent", { length: 255 }),
    createdAt: d
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const verification = sqliteTable(
  "verification",
  (d) => ({
    id: d
      .text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: d.text("identifier", { length: 255 }).notNull(),
    value: d.text("value", { length: 255 }).notNull(),
    expiresAt: d.integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: d
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

export const schema = {
  promptFolders,
  prompts,

  linkFolders,
  links,
};
