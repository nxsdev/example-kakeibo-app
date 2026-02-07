import { db } from "@example-kakeibo-app/db";
import { budgets, categories, transactions } from "@example-kakeibo-app/db/schema/index";
import { eq, and, sql, like } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { budgetListInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof budgetListInputSchema>;

/** 月別予算一覧を取得する（カテゴリ情報 + 実績付き） */
export async function handleListBudgets(input: Input, context: AuthenticatedContext) {
  const budgetRows = await db
    .select({
      id: budgets.id,
      category_id: budgets.category_id,
      amount: budgets.amount,
      month: budgets.month,
      user_id: budgets.user_id,
      created_at: budgets.created_at,
      category: {
        id: categories.id,
        name: categories.name,
        type: categories.type,
        icon: categories.icon,
        color: categories.color,
        user_id: categories.user_id,
        created_at: categories.created_at,
      },
    })
    .from(budgets)
    .leftJoin(categories, eq(budgets.category_id, categories.id))
    .where(and(eq(budgets.user_id, context.session.user.id), eq(budgets.month, input.month)));

  // 各予算に対する実績（支出合計）を取得
  const spentResults = await db
    .select({
      category_id: transactions.category_id,
      total: sql<number>`sum(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.user_id, context.session.user.id),
        eq(transactions.type, "expense"),
        like(transactions.date, `${input.month}%`),
      ),
    )
    .groupBy(transactions.category_id);

  const spentMap = new Map(spentResults.map((r) => [r.category_id, r.total ?? 0]));

  const items = budgetRows.map((row) => ({
    ...row,
    spent: spentMap.get(row.category_id) ?? 0,
  }));

  return { items };
}
