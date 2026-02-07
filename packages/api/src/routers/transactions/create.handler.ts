import { db } from "@example-kakeibo-app/db";
import { transactions } from "@example-kakeibo-app/db/schema/index";
import type { AuthenticatedContext } from "../../context";
import type { TransactionCreateInput } from "@example-kakeibo-app/contract";

/** 取引を新規作成する */
export async function handleCreateTransaction(input: TransactionCreateInput, context: AuthenticatedContext) {
  const [transaction] = await db
    .insert(transactions)
    .values({
      ...input,
      user_id: context.session.user.id,
    })
    .returning();

  return transaction!;
}
