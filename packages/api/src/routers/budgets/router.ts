import { implement } from "@orpc/server";
import { budgetContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { assertAuth } from "../../context";
import { handleListBudgets } from "./list.handler";
import { handleCreateBudget } from "./create.handler";
import { handleUpdateBudget } from "./update.handler";

/** 予算ルーター（コントラクト実装） */
const os = implement(budgetContract).$context<Context>();

const list = os.list.handler(({ input, context }) => {
  assertAuth(context);
  return handleListBudgets(input, context);
});

const create = os.create.handler(({ input, context }) => {
  assertAuth(context);
  return handleCreateBudget(input, context);
});

const update = os.update.handler(({ input, context }) => {
  assertAuth(context);
  return handleUpdateBudget(input, context);
});

export const budgetRouter = os.router({
  list,
  create,
  update,
});
