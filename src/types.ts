import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "./db/schema";

export type AppSchema = typeof schema;

export type Env = {
  Bindings: {
    DB: D1Database;
    APP_KV: KVNamespace;
  };
  Variables: {
    db: DrizzleD1Database<AppSchema>;  // injected by middleware
  };
};