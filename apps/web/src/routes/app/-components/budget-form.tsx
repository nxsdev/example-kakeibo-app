import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4-mini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** 予算追加フォーム */
export function BudgetForm({
  categories,
  month,
  onSubmit,
  onCancel,
  isPending,
}: {
  categories: { id: string; name: string; color: string | null }[];
  month: string;
  onSubmit: (data: { category_id: string; amount: number; month: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const form = useForm({
    defaultValues: {
      category_id: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      onSubmit({ ...value, month });
    },
    validators: {
      onSubmit: z.object({
        category_id: z.string().check(z.minLength(1, "カテゴリを選択してください")),
        amount: z.number().check(z.positive("予算額は0より大きい値を入力してください")),
      }),
    },
  });

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 text-sm font-medium">予算追加</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-3"
      >
        <form.Field name="category_id">
          {(field) => (
            <div className="space-y-1">
              <Label>カテゴリ</Label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`flex items-center gap-2 rounded border p-2 text-xs ${
                      field.state.value === cat.id ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => field.handleChange(cat.id)}
                  >
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: cat.color ?? "#888" }}
                    />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form.Field>
        <form.Field name="amount">
          {(field) => (
            <div className="space-y-1">
              <Label>予算額</Label>
              <Input
                type="number"
                placeholder="50000"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </div>
          )}
        </form.Field>
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "保存中..." : "保存"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
}
