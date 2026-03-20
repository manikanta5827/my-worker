import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// Call this inside each request — pass in env.DB binding
export function createDb(d1: D1Database) {
  return drizzle(d1, { schema, logger: true });
}

export type Db = ReturnType<typeof createDb>;