import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "@formkit/tempo";
import { Plus } from "lucide-react";

import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import { BudgetForm } from "./-components/budget-form";

export const Route = createFileRoute("/app/budgets")({
  component: BudgetsPage,
});

function BudgetsPage() {
  const queryClient = useQueryClient();
  const [currentMonth] = useState(format(new Date(), "YYYY-MM"));
  const [showForm, setShowForm] = useState(false);

  const budgets = useQuery(
    orpc.budgets.list.queryOptions({ input: { month: currentMonth } }),
  );

  const expenseCategories = useQuery(
    orpc.categories.list.queryOptions({ input: { type: "expense" } }),
  );

  const createMutation = useMutation(
    orpc.budgets.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries();
        toast.success("予算を設定しました");
        setShowForm(false);
      },
    }),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">予算管理</h2>
          <p className="text-sm text-muted-foreground">{currentMonth}</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="size-4" />
          予算追加
        </Button>
      </div>

      {/* 予算追加フォーム */}
      {showForm && (
        <BudgetForm
          categories={expenseCategories.data ?? []}
          month={currentMonth}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
          isPending={createMutation.isPending}
        />
      )}

      {/* 予算一覧 */}
      <div className="space-y-3">
        {budgets.data?.items.map((budget) => {
          const percentage = budget.amount > 0
            ? Math.min(Math.round((budget.spent / budget.amount) * 100), 100)
            : 0;
          const isOver = budget.spent > budget.amount;

          return (
            <div key={budget.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: budget.category?.color ?? "#888" }}
                  />
                  <span className="font-medium">{budget.category?.name ?? "不明"}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {budget.spent.toLocaleString()} / {budget.amount.toLocaleString()}円
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${isOver ? "bg-red-500" : "bg-primary"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {isOver && (
                <p className="mt-1 text-xs text-red-500">
                  予算を{(budget.spent - budget.amount).toLocaleString()}円超過しています
                </p>
              )}
            </div>
          );
        })}
        {budgets.data?.items.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            予算が設定されていません
          </p>
        )}
      </div>
    </div>
  );
}
