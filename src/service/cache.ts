import { Hono } from "hono";
import type { Env } from "../types";

export const cacheRoute = new Hono<Env>();

// GET /cache/:key
cacheRoute.get("/:key", async (c) => {
  const key = c.req.param("key");
  const value = await c.env.APP_KV.get(key, "json");

  if (value === null) return c.json({ error: "Key not found" }, 404);
  return c.json({ key, value });
});

// PUT /cache/:key  — store anything as JSON with optional TTL
cacheRoute.put("/:key", async (c) => {
  const key = c.req.param("key");
  const body = await c.req.json<{ value: unknown; ttl?: number }>();

  await c.env.APP_KV.put(key, JSON.stringify(body.value), {
    expirationTtl: body.ttl,  // seconds, optional
  });

  return c.json({ stored: true, key });
});

// DELETE /cache/:key
cacheRoute.delete("/:key", async (c) => {
  const key = c.req.param("key");
  await c.env.APP_KV.delete(key);
  return c.json({ deleted: true, key });
});

// GET /cache?prefix=user: — list keys by prefix
cacheRoute.get("/", async (c) => {
  const prefix = c.req.query("prefix") ?? "";
  const list = await c.env.APP_KV.list({ prefix });
  return c.json({ keys: list.keys.map((k) => k.name) });
});