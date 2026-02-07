import { implement } from "@orpc/server";
import { transactionContract } from "@example-kakeibo-app/contract";
import type { Context } from "../../context";
import { assertAuth } from "../../context";
import { handleListTransactions } from "./list.handler";
import { handleGetTransaction } from "./get.handler";
import { handleCreateTransaction } from "./create.handler";
import { handleUpdateTransaction } from "./update.handler";
import { handleDeleteTransaction } from "./delete.handler";

/** 取引ルーター（コントラクト実装） */
const os = implement(transactionContract).$context<Context>();

const list = os.list.handler(({ input, context }) => {
  assertAuth(context);
  return handleListTransactions(input, context);
});

const get = os.get.handler(({ input, context }) => {
  assertAuth(context);
  return handleGetTransaction(input, context);
});

const create = os.create.handler(({ input, context }) => {
  assertAuth(context);
  return handleCreateTransaction(input, context);
});

const update = os.update.handler(({ input, context }) => {
  assertAuth(context);
  return handleUpdateTransaction(input, context);
});

const del = os.delete.handler(({ input, context }) => {
  assertAuth(context);
  return handleDeleteTransaction(input, context);
});

export const transactionRouter = os.router({
  list,
  get,
  create,
  update,
  delete: del,
});
