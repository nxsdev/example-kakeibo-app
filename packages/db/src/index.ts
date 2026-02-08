import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type * as schema from "./schema";

/** Durable Object SQLite 用の Drizzle インスタンス型 */
export type Database = BaseSQLiteDatabase<"sync", any, typeof schema>;

export * as schema from "./schema";
