import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

export const promptFolders = sqliteTable(
  "prompt_folder",
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.text({ length: 255 }).notNull(),
    icon: d.text({ length: 255 }).notNull(),
    createdById: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    folderId: d
      .text({ length: 255 })
      .notNull()
      .references(() => promptFolders.id, { onDelete: "cascade" }),
    title: d.text({ length: 255 }).notNull(),
    promptText: d.text().notNull(),
    model: d.text({ length: 255 }).notNull(),
    imageUrl: d.text({ length: 255 }),
    createdById: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.text({ length: 255 }).notNull(),
    icon: d.text({ length: 255 }).notNull(),
    createdById: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    folderId: d
      .text({ length: 255 })
      .notNull()
      .references(() => linkFolders.id, { onDelete: "cascade" }),
    title: d.text({ length: 255 }).notNull(),
    url: d.text({ length: 2048 }).notNull(),
    description: d.text(),
    createdById: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull().unique(),
  emailVerified: d.integer({ mode: "boolean" }).default(false),
  image: d.text({ length: 255 }),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id),
    accountId: d.text({ length: 255 }).notNull(),
    providerId: d.text({ length: 255 }).notNull(),
    accessToken: d.text(),
    refreshToken: d.text(),
    accessTokenExpiresAt: d.integer({ mode: "timestamp" }),
    refreshTokenExpiresAt: d.integer({ mode: "timestamp" }),
    scope: d.text({ length: 255 }),
    idToken: d.text(),
    password: d.text(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => user.id),
    token: d.text({ length: 255 }).notNull().unique(),
    expiresAt: d.integer({ mode: "timestamp" }).notNull(),
    ipAddress: d.text({ length: 255 }),
    userAgent: d.text({ length: 255 }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
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
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: d.text({ length: 255 }).notNull(),
    value: d.text({ length: 255 }).notNull(),
    expiresAt: d.integer({ mode: "timestamp" }).notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);

export const schema = {
  promptFolders,
  prompts,

  linkFolders,
  links,
};
