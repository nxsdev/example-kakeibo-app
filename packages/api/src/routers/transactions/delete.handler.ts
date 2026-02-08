import { transactions } from "@example-kakeibo-app/db/schema/index";
import { eq, and } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { transactionDeleteInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof transactionDeleteInputSchema>;

/** 取引を削除する */
export async function handleDeleteTransaction(input: Input, context: AuthenticatedContext) {
  const { db } = context;
  const [deleted] = await db
    .delete(transactions)
    .where(and(eq(transactions.id, input.id), eq(transactions.userId, context.session.user.id)))
    .returning();

  if (!deleted) {
    throw new ORPCError("NOT_FOUND", { message: "取引が見つかりません" });
  }

  return { id: deleted.id };
}
