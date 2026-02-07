import { db } from "@example-kakeibo-app/db";
import { transactions, categories } from "@example-kakeibo-app/db/schema/index";
import { eq, and, like, sql } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { dashboardByCategoryInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof dashboardByCategoryInputSchema>;

/** カテゴリ別の内訳を取得する */
export async function handleDashboardByCategory(input: Input, context: AuthenticatedContext) {
  const conditions = [
    eq(transactions.user_id, context.session.user.id),
    like(transactions.date, `${input.month}%`),
  ];

  // デフォルトは支出の内訳
  const type = input.type ?? "expense";
  conditions.push(eq(transactions.type, type));

  const results = await db
    .select({
      category_id: transactions.category_id,
      category_name: categories.name,
      category_color: categories.color,
      total: sql<number>`sum(${transactions.amount})`,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.category_id, categories.id))
    .where(and(...conditions))
    .groupBy(transactions.category_id, categories.name, categories.color)
    .orderBy(sql`sum(${transactions.amount}) desc`);

  // 合計を算出して割合を計算
  const grandTotal = results.reduce((sum, r) => sum + (r.total ?? 0), 0);

  const items = results.map((r) => ({
    category_id: r.category_id,
    category_name: r.category_name ?? "不明",
    category_color: r.category_color,
    total: r.total ?? 0,
    percentage: grandTotal > 0 ? Math.round(((r.total ?? 0) / grandTotal) * 100) : 0,
  }));

  return { items };
}
