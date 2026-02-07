import { implement } from "@orpc/server";
import { categoryContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { assertAuth } from "../../context";
import { handleListCategories } from "./list.handler";
import { handleCreateCategory } from "./create.handler";
import { handleUpdateCategory } from "./update.handler";
import { handleDeleteCategory } from "./delete.handler";

/** カテゴリルーター（コントラクト実装） */
const os = implement(categoryContract).$context<Context>();

const list = os.list.handler(({ input, context }) => {
  assertAuth(context);
  return handleListCategories(input, context);
});

const create = os.create.handler(({ input, context }) => {
  assertAuth(context);
  return handleCreateCategory(input, context);
});

const update = os.update.handler(({ input, context }) => {
  assertAuth(context);
  return handleUpdateCategory(input, context);
});

const del = os.delete.handler(({ input, context }) => {
  assertAuth(context);
  return handleDeleteCategory(input, context);
});

export const categoryRouter = os.router({
  list,
  create,
  update,
  delete: del,
});
