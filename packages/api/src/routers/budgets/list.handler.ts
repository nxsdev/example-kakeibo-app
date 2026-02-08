import { budgets, categories, transactions } from "@example-kakeibo-app/db/schema/index";
import { eq, and, like, sum } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { budgetListInputSchema } from "@example-kakeibo-app/contract";
import { computeAlertStatus } from "../../domain/budgets/compute-alert-status";

type Input = z.infer<typeof budgetListInputSchema>;

/** 月別予算一覧を取得する（カテゴリ情報 + 実績 + アラートステータス付き） */
export async function handleListBudgets(input: Input, context: AuthenticatedContext) {
  const { db } = context;
  const budgetRows = await db
    .select({
      id: budgets.id,
      categoryId: budgets.categoryId,
      amount: budgets.amount,
      alertThreshold: budgets.alertThreshold,
      month: budgets.month,
      userId: budgets.userId,
      createdAt: budgets.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
        type: categories.type,
        icon: categories.icon,
        color: categories.color,
        userId: categories.userId,
        createdAt: categories.createdAt,
      },
    })
    .from(budgets)
    .leftJoin(categories, eq(budgets.categoryId, categories.id))
    .where(and(eq(budgets.userId, context.session.user.id), eq(budgets.month, input.month)));

  // 各予算に対する実績（支出合計）を取得
  const spentResults = await db
    .select({
      categoryId: transactions.categoryId,
      total: sum(transactions.amount).mapWith(Number),
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, context.session.user.id),
        eq(transactions.type, "expense"),
        like(transactions.date, `${input.month}%`),
      ),
    )
    .groupBy(transactions.categoryId);

  const spentMap = new Map(spentResults.map((r) => [r.categoryId, r.total ?? 0]));

  const items = budgetRows.map((row) => {
    const spent = spentMap.get(row.categoryId) ?? 0;
    return {
      ...row,
      spent,
      alertStatus: computeAlertStatus(spent, row.amount, row.alertThreshold),
    };
  });

  return { items };
}
