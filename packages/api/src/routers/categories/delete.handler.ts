import { categories } from "@example-kakeibo-app/db/schema/index";
import { eq, and } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { categoryDeleteInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof categoryDeleteInputSchema>;

/** カテゴリを削除する */
export async function handleDeleteCategory(input: Input, context: AuthenticatedContext) {
  const { db } = context;
  const [deleted] = await db
    .delete(categories)
    .where(and(eq(categories.id, input.id), eq(categories.userId, context.session.user.id)))
    .returning();

  if (!deleted) {
    throw new ORPCError("NOT_FOUND", { message: "カテゴリが見つかりません" });
  }

  return { id: deleted.id };
}
