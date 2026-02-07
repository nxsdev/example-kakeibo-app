import { db } from "@example-kakeibo-app/db";
import { categories } from "@example-kakeibo-app/db/schema/index";
import { eq, and } from "drizzle-orm";
import type { AuthenticatedContext } from "../../context";
import type { z } from "zod/v4-mini";
import type { categoryListInputSchema } from "@example-kakeibo-app/contract";

type Input = z.infer<typeof categoryListInputSchema>;

/** カテゴリ一覧を取得する */
export async function handleListCategories(input: Input, context: AuthenticatedContext) {
  const conditions = [eq(categories.user_id, context.session.user.id)];

  if (input.type) {
    conditions.push(eq(categories.type, input.type));
  }

  return db
    .select()
    .from(categories)
    .where(and(...conditions))
    .orderBy(categories.created_at);
}
