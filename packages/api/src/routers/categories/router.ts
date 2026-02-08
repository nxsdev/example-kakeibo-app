import { implement } from "@orpc/server";
import { categoryContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { authMiddleware, loggingMiddleware } from "../../index";
import { handleListCategories } from "./list.handler";
import { handleCreateCategory } from "./create.handler";
import { handleUpdateCategory } from "./update.handler";
import { handleDeleteCategory } from "./delete.handler";

/** カテゴリルーター（コントラクト実装） */
const os = implement(categoryContract).$context<Context>().use(authMiddleware).use(loggingMiddleware);

const list = os.list.handler(({ input, context }) => {
  return handleListCategories(input, context);
});

const create = os.create.handler(({ input, context }) => {
  return handleCreateCategory(input, context);
});

const update = os.update.handler(({ input, context }) => {
  return handleUpdateCategory(input, context);
});

const del = os.delete.handler(({ input, context }) => {
  return handleDeleteCategory(input, context);
});

export const categoryRouter = os.router({
  list,
  create,
  update,
  delete: del,
});
