import { db } from "@example-kakeibo-app/db";
import { transactions, categories } from "@example-kakeibo-app/db/schema/index";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { transactionListInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof transactionListInputSchema>;

/** 取引一覧を取得する（ページネーション + フィルタリング付き） */
export async function handleListTransactions(input: Input, context: AuthenticatedContext) {
  const page = input.page ?? 1;
  const perPage = input.per_page ?? 20;
  const offset = (page - 1) * perPage;

  const conditions = [eq(transactions.user_id, context.session.user.id)];

  if (input.type) {
    conditions.push(eq(transactions.type, input.type));
  }
  if (input.category_id) {
    conditions.push(eq(transactions.category_id, input.category_id));
  }
  if (input.date_from) {
    conditions.push(gte(transactions.date, input.date_from));
  }
  if (input.date_to) {
    conditions.push(lte(transactions.date, input.date_to));
  }

  const whereClause = and(...conditions);

  // 件数取得
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(whereClause);
  const total = countResult?.count ?? 0;

  // データ取得（カテゴリ JOIN）
  const items = await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      type: transactions.type,
      category_id: transactions.category_id,
      date: transactions.date,
      note: transactions.note,
      user_id: transactions.user_id,
      created_at: transactions.created_at,
      updated_at: transactions.updated_at,
      category: {
        id: categories.id,
        name: categories.name,
        type: categories.type,
        icon: categories.icon,
        color: categories.color,
        user_id: categories.user_id,
        created_at: categories.created_at,
      },
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.category_id, categories.id))
    .where(whereClause)
    .orderBy(sql`${transactions.date} desc, ${transactions.created_at} desc`)
    .limit(perPage)
    .offset(offset);

  return {
    items,
    meta: {
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    },
  };
}
