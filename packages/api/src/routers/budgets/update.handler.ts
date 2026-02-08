import { budgets } from "@example-kakeibo-app/db/schema/index";
import { eq, and } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import type { AuthenticatedContext } from "../../context";
import type { BudgetUpdateInput } from "@example-kakeibo-app/contract";

/** 予算を更新する */
export async function handleUpdateBudget(input: BudgetUpdateInput, context: AuthenticatedContext) {
  const { db } = context;
  const { id, ...data } = input;

  const [budget] = await db
    .update(budgets)
    .set(data)
    .where(and(eq(budgets.id, id), eq(budgets.userId, context.session.user.id)))
    .returning();

  if (!budget) {
    throw new ORPCError("NOT_FOUND", { message: "予算が見つかりません" });
  }

  return budget;
}
