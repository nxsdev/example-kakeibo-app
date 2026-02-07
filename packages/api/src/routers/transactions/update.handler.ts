import { db } from "@example-kakeibo-app/db";
import { transactions } from "@example-kakeibo-app/db/schema/index";
import { eq, and } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import type { AuthenticatedContext } from "../../context";
import type { TransactionUpdateInput } from "@example-kakeibo-app/contract";

/** 取引を更新する */
export async function handleUpdateTransaction(input: TransactionUpdateInput, context: AuthenticatedContext) {
  const { id, ...data } = input;

  const [transaction] = await db
    .update(transactions)
    .set({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .where(and(eq(transactions.id, id), eq(transactions.user_id, context.session.user.id)))
    .returning();

  if (!transaction) {
    throw new ORPCError("NOT_FOUND", { message: "取引が見つかりません" });
  }

  return transaction;
}
