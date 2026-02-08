import { transactions } from "@example-kakeibo-app/db/schema/index";
import { eq, and, inArray, sql, sum } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { ReportCategoryTrendInput } from "@example-kakeibo-app/contract";
import { generateMonthRange, getCurrentMonth } from "../../domain/reports/generate-month-range";

/** カテゴリ別の月次推移を取得する */
export async function handleCategoryTrend(
  input: ReportCategoryTrendInput,
  context: AuthenticatedContext,
) {
  const { db } = context;
  const count = input.months ?? 6;
  const baseMonth = getCurrentMonth();
  const months = generateMonthRange(baseMonth, count);

  // substr(date, 1, 7) で YYYY-MM を取り出してグルーピング
  const results = await db
    .select({
      month: sql<string>`substr(${transactions.date}, 1, 7)`,
      total: sum(transactions.amount).mapWith(Number),
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, context.session.user.id),
        eq(transactions.categoryId, input.categoryId),
        inArray(sql`substr(${transactions.date}, 1, 7)`, months),
      ),
    )
    .groupBy(sql`substr(${transactions.date}, 1, 7)`);

  const resultMap = new Map(results.map((r) => [r.month, r.total ?? 0]));

  // 全月分を埋める（データがない月は 0）
  const items = months.toReversed().map((month) => ({ month, total: resultMap.get(month) ?? 0 }));

  return { categoryId: input.categoryId, items };
}
