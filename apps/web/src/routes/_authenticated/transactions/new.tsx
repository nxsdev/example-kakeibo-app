import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "@formkit/tempo";
import { z } from "zod/v4-mini";
import { AnimatePresence, motion } from "framer-motion";

import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TransactionType } from "@example-kakeibo-app/contract";

export const Route = createFileRoute("/_authenticated/transactions/new")({
  loader: async ({ context }) => {
    const today = format(new Date(), "YYYY-MM-DD");

    await context.queryClient.ensureQueryData(
      context.orpc.categories.list.queryOptions({ input: {} }),
    );

    return { today };
  },
  component: NewTransactionPage,
});

/** マルチステップ取引登録フォーム */
function NewTransactionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { today } = Route.useLoaderData();
  const [step, setStep] = useState(0);

  const { data: categories } = useSuspenseQuery(
    orpc.categories.list.queryOptions({ input: {} }),
  );

  const createMutation = useMutation(
    orpc.transactions.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.transactions.key() });
        queryClient.invalidateQueries({ queryKey: orpc.dashboard.key() });
        queryClient.invalidateQueries({ queryKey: orpc.budgets.key() });
        toast.success("取引を登録しました");
        navigate({ to: "/transactions" });
      },
      onError: (error) => {
        toast.error(`登録に失敗しました: ${error.message}`);
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      type: "expense" as TransactionType,
      categoryId: "",
      amount: 0,
      date: today,
      note: "",
    },
    onSubmit: async ({ value }) => {
      createMutation.mutate(value);
    },
    validators: {
      onSubmit: z.object({
        type: z.enum(["income", "expense"]),
        categoryId: z.string().check(z.minLength(1, "カテゴリを選択してください")),
        amount: z.number().check(z.positive("金額は0より大きい値を入力してください")),
        date: z.string().check(z.minLength(1, "日付を入力してください")),
        note: z.string(),
      }),
    },
  });

  const filteredCategories = categories.items.filter(
    (c) => c.type === form.getFieldValue("type"),
  );

  const steps = [
    { title: "種別選択", description: "収入または支出を選んでください" },
    { title: "カテゴリ", description: "カテゴリを選んでください" },
    { title: "詳細入力", description: "金額と日付を入力してください" },
    { title: "確認", description: "内容を確認してください" },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="text-2xl font-bold">取引登録</h2>

      {/* ステップインジケーター */}
      <div className="flex gap-2">
        {steps.map((s, i) => (
          <div key={s.title} className="flex-1">
            <div className={`h-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
            <p
              className={`mt-1 text-xs ${i <= step ? "text-foreground" : "text-muted-foreground"}`}
            >
              {s.title}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{steps[step]?.description}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) {
            setStep(step + 1);
          } else {
            form.handleSubmit();
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Step 0: 種別選択 */}
            {step === 0 ? (
              <form.Field name="type">
                {(field) => (
                  <div className="grid grid-cols-2 gap-4">
                    {(["expense", "income"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`rounded-lg border p-6 text-center transition-colors ${
                          field.state.value === type
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => {
                          field.handleChange(type);
                          // カテゴリリセット
                          form.setFieldValue("categoryId", "");
                        }}
                      >
                        <p className="text-2xl">{type === "expense" ? "💸" : "💰"}</p>
                        <p className="mt-2 font-medium">{type === "expense" ? "支出" : "収入"}</p>
                      </button>
                    ))}
                  </div>
                )}
              </form.Field>
            ) : null}

            {/* Step 1: カテゴリ選択 */}
            {step === 1 ? (
              <form.Field name="categoryId">
                {(field) => (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors ${
                          field.state.value === cat.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => field.handleChange(cat.id)}
                      >
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: cat.color ?? "#888" }}
                        />
                        {cat.name}
                      </button>
                    ))}
                    {filteredCategories.length === 0 ? (
                      <p className="col-span-2 text-sm text-muted-foreground">
                        カテゴリがありません。先にカテゴリを作成してください。
                      </p>
                    ) : null}
                  </div>
                )}
              </form.Field>
            ) : null}

            {/* Step 2: 金額・日付・メモ */}
            {step === 2 ? (
              <>
                <form.Field name="amount">
                  {(field) => (
                    <div className="space-y-2">
                      <Label>金額</Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="date">
                  {(field) => (
                    <div className="space-y-2">
                      <Label>日付</Label>
                      <Input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="note">
                  {(field) => (
                    <div className="space-y-2">
                      <Label>メモ（任意）</Label>
                      <Input
                        placeholder="ランチ、電車賃など"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </>
            ) : null}

            {/* Step 3: 確認 */}
            {step === 3 ? (
              <div className="space-y-3 rounded-lg border p-4">
                <ConfirmRow
                  label="種別"
                  value={form.getFieldValue("type") === "income" ? "収入" : "支出"}
                />
                <ConfirmRow
                  label="カテゴリ"
                  value={
                    filteredCategories.find((c) => c.id === form.getFieldValue("categoryId"))
                      ?.name ?? "-"
                  }
                />
                <ConfirmRow
                  label="金額"
                  value={`${form.getFieldValue("amount").toLocaleString()}円`}
                />
                <ConfirmRow label="日付" value={form.getFieldValue("date")} />
                <ConfirmRow label="メモ" value={form.getFieldValue("note") || "-"} />
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* ナビゲーションボタン */}
        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (step === 0) {
                navigate({ to: "/transactions" });
              } else {
                setStep(step - 1);
              }
            }}
          >
            {step === 0 ? "キャンセル" : "戻る"}
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {step < 3 ? "次へ" : createMutation.isPending ? "登録中..." : "登録する"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
