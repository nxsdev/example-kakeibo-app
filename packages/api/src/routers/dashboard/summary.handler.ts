import { transactions } from "@example-kakeibo-app/db/schema/index";
import { eq, and, like, sum, count } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { dashboardSummaryInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof dashboardSummaryInputSchema>;

/** 月次サマリーを取得する（収入・支出・残高・件数） */
export async function handleDashboardSummary(input: Input, context: AuthenticatedContext) {
  const { db } = context;
  const results = await db
    .select({
      type: transactions.type,
      total: sum(transactions.amount).mapWith(Number),
      count: count(),
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, context.session.user.id),
        like(transactions.date, `${input.month}%`),
      ),
    )
    .groupBy(transactions.type);

  const income = results.find((r) => r.type === "income");
  const expense = results.find((r) => r.type === "expense");

  const totalIncome = income?.total ?? 0;
  const totalExpense = expense?.total ?? 0;

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: (income?.count ?? 0) + (expense?.count ?? 0),
  };
}
