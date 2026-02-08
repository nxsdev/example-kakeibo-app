import type { Session, User } from "better-auth";
import type { Database } from "@example-kakeibo-app/db";
import type { Logger } from "./logger";

export type Context = {
  session: { user: User; session: Session } | null;
  db: Database;
  requestId: string;
};

/** 認証済みコンテキスト（session が保証される） */
export type AuthenticatedContext = Context & {
  session: NonNullable<Context["session"]>;
  logger: Logger;
};
