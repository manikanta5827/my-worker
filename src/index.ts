import { Hono } from "hono";
import { createDb } from "./db";
import { usersRoute } from "./service/users";
import { cacheRoute } from "./service/cache";
import type { Env } from "./types";

const app = new Hono<Env>();

// ── Middleware: inject drizzle db into context ─────────────────────────
app.use("*", async (c, next) => {
  c.set("db", createDb(c.env.DB));
  await next();
});

// ── Routes ─────────────────────────────────────────────────────────────
app.route("/users", usersRoute);
app.route("/cache", cacheRoute);

app.get("/", (c) => c.json({ status: "ok" }));

export default app;