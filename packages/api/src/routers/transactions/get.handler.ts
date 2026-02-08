import { transactions } from "@example-kakeibo-app/db/schema/index";
import { eq, and } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { transactionGetInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof transactionGetInputSchema>;

/** 取引を1件取得する */
export async function handleGetTransaction(input: Input, context: AuthenticatedContext) {
  const { db } = context;
  const [transaction] = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, input.id), eq(transactions.userId, context.session.user.id)));

  if (!transaction) {
    throw new ORPCError("NOT_FOUND", { message: "取引が見つかりません" });
  }

  return transaction;
}
