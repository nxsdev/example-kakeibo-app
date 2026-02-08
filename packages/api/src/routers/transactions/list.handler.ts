import { transactions, categories } from "@example-kakeibo-app/db/schema/index";
import { eq, and, gte, lte, desc, count } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { transactionListInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof transactionListInputSchema>;

/** 取引一覧を取得する（ページネーション + フィルタリング付き） */
export async function handleListTransactions(input: Input, context: AuthenticatedContext) {
  const { db } = context;
  const page = input.page ?? 1;
  const perPage = input.perPage ?? 20;
  const offset = (page - 1) * perPage;

  const conditions = [eq(transactions.userId, context.session.user.id)];

  if (input.type) {
    conditions.push(eq(transactions.type, input.type));
  }
  if (input.categoryId) {
    conditions.push(eq(transactions.categoryId, input.categoryId));
  }
  if (input.dateFrom) {
    conditions.push(gte(transactions.date, input.dateFrom));
  }
  if (input.dateTo) {
    conditions.push(lte(transactions.date, input.dateTo));
  }

  const whereClause = and(...conditions);

  // 件数取得
  const [countResult] = await db.select({ count: count() }).from(transactions).where(whereClause);
  const total = countResult?.count ?? 0;

  // データ取得（カテゴリ JOIN）
  const items = await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      type: transactions.type,
      categoryId: transactions.categoryId,
      date: transactions.date,
      note: transactions.note,
      userId: transactions.userId,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        type: categories.type,
        icon: categories.icon,
        color: categories.color,
        userId: categories.userId,
        createdAt: categories.createdAt,
      },
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(whereClause)
    .orderBy(desc(transactions.date), desc(transactions.createdAt))
    .limit(perPage)
    .offset(offset);

  return {
    items,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
}
