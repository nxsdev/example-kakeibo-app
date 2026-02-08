import { budgets } from "@example-kakeibo-app/db/schema/index";
import type { AuthenticatedContext } from "../../context";
import type { BudgetCreateInput } from "@example-kakeibo-app/contract";

/** 予算を新規作成する */
export async function handleCreateBudget(input: BudgetCreateInput, context: AuthenticatedContext) {
  const { db } = context;
  const [budget] = await db
    .insert(budgets)
    .values({
      ...input,
      userId: context.session.user.id,
    })
    .returning();

  return budget!;
}
