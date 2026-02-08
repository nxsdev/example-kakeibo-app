import { z } from "zod/v4-mini";
import { transactionTypeSchema } from "./common.schema";

/** カテゴリスキーマ */
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: transactionTypeSchema,
  icon: z.nullable(z.string()),
  color: z.nullable(z.string()),
  userId: z.string(),
  createdAt: z.string(),
});

/** カテゴリ一覧入力 */
export const categoryListInputSchema = z.object({
  type: z.optional(transactionTypeSchema),
});

/** カテゴリ作成入力 */
export const categoryCreateInputSchema = z.object({
  name: z.string().check(z.minLength(1, "カテゴリ名は必須です")),
  type: transactionTypeSchema,
  icon: z.optional(z.string()),
  color: z.optional(z.string()),
});

/** カテゴリ更新入力 */
export const categoryUpdateInputSchema = z.object({
  id: z.string(),
  name: z.optional(z.string().check(z.minLength(1, "カテゴリ名は必須です"))),
  icon: z.optional(z.string()),
  color: z.optional(z.string()),
});

/** カテゴリ一覧出力 */
export const categoryListOutputSchema = z.object({
  items: z.array(categorySchema),
});

/** カテゴリ削除入力 */
export const categoryDeleteInputSchema = z.object({
  id: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateInputSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateInputSchema>;
