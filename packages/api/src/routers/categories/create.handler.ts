import { db } from "@example-kakeibo-app/db";
import { categories } from "@example-kakeibo-app/db/schema/index";
import type { AuthenticatedContext } from "../../context";
import type { CategoryCreateInput } from "@example-kakeibo-app/contract";

/** カテゴリを新規作成する */
export async function handleCreateCategory(input: CategoryCreateInput, context: AuthenticatedContext) {
  const [category] = await db
    .insert(categories)
    .values({
      ...input,
      user_id: context.session.user.id,
    })
    .returning();

  return category!;
}
