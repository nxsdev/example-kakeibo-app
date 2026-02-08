import { transactions } from "@example-kakeibo-app/db/schema/index";
import type { Database } from "@example-kakeibo-app/db";
import { eq, and, like, sum } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { ReportComparisonInput } from "@example-kakeibo-app/contract";
import { getPreviousMonth } from "../../domain/reports/generate-month-range";

/** 月ごとの収支を集計する */
async function getMonthSummary(db: Database, userId: string, month: string) {
  const results = await db
    .select({
      type: transactions.type,
      total: sum(transactions.amount).mapWith(Number),
    })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), like(transactions.date, `${month}%`)))
    .groupBy(transactions.type);

  const income = results.find((r) => r.type === "income")?.total ?? 0;
  const expense = results.find((r) => r.type === "expense")?.total ?? 0;

  return { month, income, expense, balance: income - expense };
}

/** 前月比較レポートを取得する */
export async function handleComparison(
  input: ReportComparisonInput,
  context: AuthenticatedContext,
) {
  const { db } = context;
  const prevMonth = getPreviousMonth(input.month);
  const [current, previous] = await Promise.all([
    getMonthSummary(db, context.session.user.id, input.month),
    getMonthSummary(db, context.session.user.id, prevMonth),
  ]);

  return {
    current,
    previous,
    diff: {
      income: current.income - previous.income,
      expense: current.expense - previous.expense,
      balance: current.balance - previous.balance,
    },
  };
}
