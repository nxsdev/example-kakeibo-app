import { z } from "zod/v4-mini";
import { categorySchema } from "./category.schema";

/** 予算スキーマ */
export const budgetSchema = z.object({
  id: z.string(),
  category_id: z.string(),
  amount: z.number(),
  month: z.string(),
  user_id: z.string(),
  created_at: z.string(),
});

/** 予算（カテゴリ情報 + 実績付き） */
export const budgetWithDetailsSchema = z.object({
  ...budgetSchema.shape,
  category: z.nullable(categorySchema),
  spent: z.number(),
});

/** 予算一覧入力 */
export const budgetListInputSchema = z.object({
  month: z.string().check(z.minLength(1, "月を指定してください")),
});

/** 予算一覧出力 */
export const budgetListOutputSchema = z.object({
  items: z.array(budgetWithDetailsSchema),
});

/** 予算作成入力 */
export const budgetCreateInputSchema = z.object({
  category_id: z.string().check(z.minLength(1, "カテゴリを選択してください")),
  amount: z.number().check(z.positive("予算額は0より大きい値を入力してください")),
  month: z.string().check(z.minLength(1, "月を指定してください")),
});

/** 予算更新入力 */
export const budgetUpdateInputSchema = z.object({
  id: z.string(),
  amount: z.number().check(z.positive("予算額は0より大きい値を入力してください")),
});

export type Budget = z.infer<typeof budgetSchema>;
export type BudgetWithDetails = z.infer<typeof budgetWithDetailsSchema>;
export type BudgetCreateInput = z.infer<typeof budgetCreateInputSchema>;
export type BudgetUpdateInput = z.infer<typeof budgetUpdateInputSchema>;
