import { z } from "zod/v4-mini";
import {
  paginationInputSchema,
  paginationMetaSchema,
  transactionTypeSchema,
} from "./common.schema";
import { categorySchema } from "./category.schema";

/** 取引スキーマ */
export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  type: transactionTypeSchema,
  categoryId: z.string(),
  date: z.string(),
  note: z.nullable(z.string()),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  categoryId: z.optional(z.string()),
  dateFrom: z.optional(z.string()),
  dateTo: z.optional(z.string()),
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
  categoryId: z.string().check(z.minLength(1, "カテゴリを選択してください")),
  date: z.string().check(z.minLength(1, "日付を入力してください")),
  note: z.optional(z.string()),
});

/** 取引更新入力 */
export const transactionUpdateInputSchema = z.object({
  id: z.string(),
  amount: z.optional(z.number().check(z.positive("金額は0より大きい値を入力してください"))),
  type: z.optional(transactionTypeSchema),
  categoryId: z.optional(z.string()),
  date: z.optional(z.string()),
  note: z.optional(z.string()),
});

/** 取引削除入力 */
export const transactionDeleteInputSchema = z.object({
  id: z.string(),
});

/** CSVエクスポート入力 */
export const transactionExportInputSchema = z.object({
  dateFrom: z.optional(z.string()),
  dateTo: z.optional(z.string()),
});

/** CSVエクスポート出力 */
export const transactionExportOutputSchema = z.object({
  csv: z.string(),
  count: z.number(),
});

/** CSVインポート入力 */
export const transactionImportInputSchema = z.object({
  csv: z.string().check(z.minLength(1, "CSVデータを入力してください")),
});

/** インポートエラー */
export const importRowErrorSchema = z.object({
  row: z.number(),
  field: z.string(),
  message: z.string(),
});

/** CSVインポート出力 */
export const transactionImportOutputSchema = z.object({
  importedCount: z.number(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionWithCategory = z.infer<typeof transactionWithCategorySchema>;
export type TransactionCreateInput = z.infer<typeof transactionCreateInputSchema>;
export type TransactionUpdateInput = z.infer<typeof transactionUpdateInputSchema>;
export type TransactionExportInput = z.infer<typeof transactionExportInputSchema>;
export type TransactionImportInput = z.infer<typeof transactionImportInputSchema>;
