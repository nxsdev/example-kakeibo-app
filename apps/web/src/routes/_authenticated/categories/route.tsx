import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./-components/category-form";
import type { TransactionType, Category } from "@example-kakeibo-app/contract";

export const Route = createFileRoute("/_authenticated/categories")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      context.orpc.categories.list.queryOptions({ input: {} }),
    );
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TransactionType>("expense");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: categories } = useSuspenseQuery(
    orpc.categories.list.queryOptions({ input: {} }),
  );

  const createMutation = useMutation(
    orpc.categories.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.categories.key() });
        queryClient.invalidateQueries({ queryKey: orpc.budgets.key() });
        queryClient.invalidateQueries({ queryKey: orpc.dashboard.key() });
        toast.success("カテゴリを作成しました");
        setShowForm(false);
      },
    }),
  );

  const updateMutation = useMutation(
    orpc.categories.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.categories.key() });
        queryClient.invalidateQueries({ queryKey: orpc.budgets.key() });
        queryClient.invalidateQueries({ queryKey: orpc.dashboard.key() });
        toast.success("カテゴリを更新しました");
        setEditingCategory(null);
      },
    }),
  );

  const deleteMutation = useMutation(
    orpc.categories.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.categories.key() });
        queryClient.invalidateQueries({ queryKey: orpc.budgets.key() });
        queryClient.invalidateQueries({ queryKey: orpc.dashboard.key() });
        toast.success("カテゴリを削除しました");
      },
    }),
  );

  const filtered = categories.items.filter((c) => c.type === activeTab);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">カテゴリ管理</h2>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
          }}
        >
          <Plus className="size-4" />
          追加
        </Button>
      </div>

      {/* タブ */}
      <div className="flex gap-2">
        {(["expense", "income"] as const).map((type) => (
          <Button
            key={type}
            variant={activeTab === type ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(type)}
          >
            {type === "expense" ? "支出" : "収入"}
          </Button>
        ))}
      </div>

      {/* フォーム（追加/編集） */}
      {showForm || editingCategory ? (
        <CategoryForm
          editing={editingCategory}
          type={activeTab}
          onSubmit={(data) => {
            if (editingCategory) {
              updateMutation.mutate({ id: editingCategory.id, ...data });
            } else {
              createMutation.mutate({ ...data, type: activeTab });
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      ) : null}

      {/* カテゴリ一覧 */}
      <div className="space-y-2">
        {filtered.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div
                className="size-4 rounded-full"
                style={{ backgroundColor: cat.color ?? "#888" }}
              />
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  setEditingCategory(cat);
                  setShowForm(false);
                }}
              >
                <Pencil className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  if (confirm("このカテゴリを削除しますか？")) {
                    deleteMutation.mutate({ id: cat.id });
                  }
                }}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">カテゴリがありません</p>
        ) : null}
      </div>
    </div>
  );
}
