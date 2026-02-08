import { z } from "zod/v4-mini";

/** 月比較入力 */
export const reportComparisonInputSchema = z.object({
  month: z.string().check(z.minLength(1, "月を指定してください")),
});

/** 月比較出力 */
export const reportComparisonOutputSchema = z.object({
  current: z.object({
    month: z.string(),
    income: z.number(),
    expense: z.number(),
    balance: z.number(),
  }),
  previous: z.object({
    month: z.string(),
    income: z.number(),
    expense: z.number(),
    balance: z.number(),
  }),
  diff: z.object({
    income: z.number(),
    expense: z.number(),
    balance: z.number(),
  }),
});

/** カテゴリ別推移入力 */
export const reportCategoryTrendInputSchema = z.object({
  categoryId: z.string().check(z.minLength(1, "カテゴリを指定してください")),
  months: z.optional(z.number().check(z.minimum(1), z.maximum(12))),
});

/** カテゴリ別推移アイテム */
export const categoryTrendItemSchema = z.object({
  month: z.string(),
  total: z.number(),
});

/** カテゴリ別推移出力 */
export const reportCategoryTrendOutputSchema = z.object({
  categoryId: z.string(),
  items: z.array(categoryTrendItemSchema),
});

/** 月次合計入力 */
export const reportMonthlyTotalsInputSchema = z.object({
  months: z.optional(z.number().check(z.minimum(1), z.maximum(12))),
});

/** 月次合計アイテム */
export const monthlyTotalItemSchema = z.object({
  month: z.string(),
  income: z.number(),
  expense: z.number(),
  balance: z.number(),
});

/** 月次合計出力 */
export const reportMonthlyTotalsOutputSchema = z.object({
  items: z.array(monthlyTotalItemSchema),
});

export type ReportComparisonInput = z.infer<typeof reportComparisonInputSchema>;
export type ReportCategoryTrendInput = z.infer<typeof reportCategoryTrendInputSchema>;
export type ReportMonthlyTotalsInput = z.infer<typeof reportMonthlyTotalsInputSchema>;
