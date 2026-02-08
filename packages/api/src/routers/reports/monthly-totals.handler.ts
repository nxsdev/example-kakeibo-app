import { transactions } from "@example-kakeibo-app/db/schema/index";
import { eq, and, inArray, sql, sum } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { ReportMonthlyTotalsInput } from "@example-kakeibo-app/contract";
import { generateMonthRange, getCurrentMonth } from "../../domain/reports/generate-month-range";

/** 月次合計レポートを取得する */
export async function handleMonthlyTotals(
  input: ReportMonthlyTotalsInput,
  context: AuthenticatedContext,
) {
  const { db } = context;
  const count = input.months ?? 6;
  const baseMonth = getCurrentMonth();
  const months = generateMonthRange(baseMonth, count);

  const results = await db
    .select({
      month: sql<string>`substr(${transactions.date}, 1, 7)`,
      type: transactions.type,
      total: sum(transactions.amount).mapWith(Number),
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, context.session.user.id),
        inArray(sql`substr(${transactions.date}, 1, 7)`, months),
      ),
    )
    .groupBy(sql`substr(${transactions.date}, 1, 7)`, transactions.type);

  // month → { income, expense } のマップを構築
  const monthMap = new Map<string, { income: number; expense: number }>();
  for (const r of results) {
    const entry = monthMap.get(r.month) ?? { income: 0, expense: 0 };
    if (r.type === "income") entry.income = r.total ?? 0;
    if (r.type === "expense") entry.expense = r.total ?? 0;
    monthMap.set(r.month, entry);
  }

  const items = months.toReversed().map((month) => {
    const entry = monthMap.get(month) ?? { income: 0, expense: 0 };
    return {
      month,
      income: entry.income,
      expense: entry.expense,
      balance: entry.income - entry.expense,
    };
  });

  return { items };
}
