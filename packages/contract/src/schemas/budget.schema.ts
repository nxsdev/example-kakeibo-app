import { z } from "zod/v4-mini";
import { categorySchema } from "./category.schema";

/** アラートステータス */
export const budgetAlertStatusSchema = z.enum(["none", "warning", "exceeded"]);

/** 予算スキーマ */
export const budgetSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  amount: z.number(),
  alertThreshold: z.number(),
  month: z.string(),
  userId: z.string(),
  createdAt: z.string(),
});

/** 予算（カテゴリ情報 + 実績 + アラートステータス付き） */
export const budgetWithDetailsSchema = z.object({
  ...budgetSchema.shape,
  category: z.nullable(categorySchema),
  spent: z.number(),
  alertStatus: budgetAlertStatusSchema,
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
  categoryId: z.string().check(z.minLength(1, "カテゴリを選択してください")),
  amount: z.number().check(z.positive("予算額は0より大きい値を入力してください")),
  month: z.string().check(z.minLength(1, "月を指定してください")),
  alertThreshold: z.optional(z.number().check(z.minimum(0), z.maximum(100))),
});

/** 予算更新入力 */
export const budgetUpdateInputSchema = z.object({
  id: z.string(),
  amount: z.optional(z.number().check(z.positive("予算額は0より大きい値を入力してください"))),
  alertThreshold: z.optional(z.number().check(z.minimum(0), z.maximum(100))),
});

export type Budget = z.infer<typeof budgetSchema>;
export type BudgetWithDetails = z.infer<typeof budgetWithDetailsSchema>;
export type BudgetAlertStatus = z.infer<typeof budgetAlertStatusSchema>;
export type BudgetCreateInput = z.infer<typeof budgetCreateInputSchema>;
export type BudgetUpdateInput = z.infer<typeof budgetUpdateInputSchema>;
