import { transactions, categories } from "@example-kakeibo-app/db/schema/index";
import { eq, and, like, sum, desc } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { dashboardByCategoryInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof dashboardByCategoryInputSchema>;

/** カテゴリ別の内訳を取得する */
export async function handleDashboardByCategory(input: Input, context: AuthenticatedContext) {
  const { db } = context;
  const conditions = [
    eq(transactions.userId, context.session.user.id),
    like(transactions.date, `${input.month}%`),
  ];

  // デフォルトは支出の内訳
  const type = input.type ?? "expense";
  conditions.push(eq(transactions.type, type));

  const results = await db
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      total: sum(transactions.amount).mapWith(Number),
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...conditions))
    .groupBy(transactions.categoryId, categories.name, categories.color)
    .orderBy(desc(sum(transactions.amount)));

  // 合計を算出して割合を計算
  const grandTotal = results.reduce((sum, r) => sum + (r.total ?? 0), 0);

  const items = results.map((r) => ({
    categoryId: r.categoryId,
    categoryName: r.categoryName ?? "不明",
    categoryColor: r.categoryColor,
    total: r.total ?? 0,
    percentage: grandTotal > 0 ? Math.round(((r.total ?? 0) / grandTotal) * 100) : 0,
  }));

  return { items };
}
