import { int, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ── USERS ─────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id:        int().primaryKey({ autoIncrement: true }),
  name:      text().notNull(),
  email:     text().notNull().unique(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (t) => [
  index("idx_users_email").on(t.email),
]);

// ── POSTS ─────────────────────────────────────────────────────────────
export const posts = sqliteTable("posts", {
  id:        int().primaryKey({ autoIncrement: true }),
  userId:    int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title:     text().notNull(),
  body:      text(),
  published: int({ mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
}, (t) => [
  index("idx_posts_user_id").on(t.userId),
]);

// ── RELATIONS (for drizzle joins) ──────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
}));

// ── TYPES ──────────────────────────────────────────────────────────────
export type User     = typeof users.$inferSelect;
export type NewUser  = typeof users.$inferInsert;
export type Post     = typeof posts.$inferSelect;
export type NewPost  = typeof posts.$inferInsert;