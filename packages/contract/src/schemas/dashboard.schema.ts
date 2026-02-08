import { z } from "zod/v4-mini";

/** ダッシュボードサマリー入力 */
export const dashboardSummaryInputSchema = z.object({
  month: z.string().check(z.minLength(1, "月を指定してください")),
});

/** ダッシュボードサマリー出力 */
export const dashboardSummaryOutputSchema = z.object({
  totalIncome: z.number(),
  totalExpense: z.number(),
  balance: z.number(),
  transactionCount: z.number(),
});

/** カテゴリ別内訳入力 */
export const dashboardByCategoryInputSchema = z.object({
  month: z.string().check(z.minLength(1, "月を指定してください")),
  type: z.optional(z.enum(["income", "expense"])),
});

/** カテゴリ別内訳アイテム */
export const categoryBreakdownItemSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  categoryColor: z.nullable(z.string()),
  total: z.number(),
  percentage: z.number(),
});

/** カテゴリ別内訳出力 */
export const dashboardByCategoryOutputSchema = z.object({
  items: z.array(categoryBreakdownItemSchema),
});

export type DashboardSummary = z.infer<typeof dashboardSummaryOutputSchema>;
export type CategoryBreakdownItem = z.infer<typeof categoryBreakdownItemSchema>;
