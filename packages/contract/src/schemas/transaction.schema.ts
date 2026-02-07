import { z } from "zod/v4-mini";
import { paginationInputSchema, paginationMetaSchema, transactionTypeSchema } from "./common.schema";
import { categorySchema } from "./category.schema";

/** 取引スキーマ */
export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: transactionTypeSchema,
  category_id: z.string(),
  date: z.string(),
  note: z.nullable(z.string()),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

/** 取引（カテゴリ情報付き） */
export const transactionWithCategorySchema = z.object({
  ...transactionSchema.shape,
  category: z.nullable(categorySchema),
});

/** 取引一覧入力 */
export const transactionListInputSchema = z.object({
  ...paginationInputSchema.shape,
  type: z.optional(transactionTypeSchema),
  category_id: z.optional(z.string()),
  date_from: z.optional(z.string()),
  date_to: z.optional(z.string()),
});

/** 取引一覧出力 */
export const transactionListOutputSchema = z.object({
  items: z.array(transactionWithCategorySchema),
  meta: paginationMetaSchema,
});

/** 取引取得入力 */
export const transactionGetInputSchema = z.object({
  id: z.string(),
});

/** 取引作成入力 */
export const transactionCreateInputSchema = z.object({
  amount: z.number().check(z.positive("金額は0より大きい値を入力してください")),
  type: transactionTypeSchema,
  category_id: z.string().check(z.minLength(1, "カテゴリを選択してください")),
  date: z.string().check(z.minLength(1, "日付を入力してください")),
  note: z.optional(z.string()),
});

/** 取引更新入力 */
export const transactionUpdateInputSchema = z.object({
  id: z.string(),
  amount: z.optional(z.number().check(z.positive("金額は0より大きい値を入力してください"))),
  type: z.optional(transactionTypeSchema),
  category_id: z.optional(z.string()),
  date: z.optional(z.string()),
  note: z.optional(z.string()),
});

/** 取引削除入力 */
export const transactionDeleteInputSchema = z.object({
  id: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionWithCategory = z.infer<typeof transactionWithCategorySchema>;
export type TransactionCreateInput = z.infer<typeof transactionCreateInputSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionUpdateInputSchema>;
