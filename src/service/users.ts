import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { users, posts } from "../db/schema";
import type { Env } from "../types";

export const usersRoute = new Hono<Env>();

// GET /users — list all
usersRoute.get("/", async (c) => {
  const db = c.get("db");
  const all = await db.select().from(users).all();
  return c.json(all);
});

// GET /users/:id — with their posts (JOIN via drizzle relations)
usersRoute.get("/:id", async (c) => {
  const db = c.get("db");
  const id = Number(c.req.param("id"));

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: { posts: true },   // joins posts automatically via relations
  });

  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json(user);
});

// POST /users — create
usersRoute.post("/", async (c) => {
  const db = c.get("db");
  const body = await c.req.json<{ name: string; email: string }>();

  const [created] = await db
    .insert(users)
    .values({ name: body.name, email: body.email })
    .returning();

  return c.json(created, 201);
});

// PUT /users/:id — update
usersRoute.put("/:id", async (c) => {
  const db = c.get("db");
  const id = Number(c.req.param("id"));
  const body = await c.req.json<Partial<{ name: string; email: string }>>();

  const [updated] = await db
    .update(users)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(users.id, id))
    .returning();

  if (!updated) return c.json({ error: "User not found" }, 404);
  return c.json(updated);
});

// DELETE /users/:id
usersRoute.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = Number(c.req.param("id"));

  const [deleted] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  if (!deleted) return c.json({ error: "User not found" }, 404);
  return c.json({ deleted: true, id });
});