import { categories } from "@example-kakeibo-app/db/schema/index";
import { eq, and } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import type { AuthenticatedContext } from "../../context";
import type { CategoryUpdateInput } from "@example-kakeibo-app/contract";

/** カテゴリを更新する */
export async function handleUpdateCategory(
  input: CategoryUpdateInput,
  context: AuthenticatedContext,
) {
  const { db } = context;
  const { id, ...data } = input;

  const [category] = await db
    .update(categories)
    .set(data)
    .where(and(eq(categories.id, id), eq(categories.userId, context.session.user.id)))
    .returning();

  if (!category) {
    throw new ORPCError("NOT_FOUND", { message: "カテゴリが見つかりません" });
  }

  return category;
}
