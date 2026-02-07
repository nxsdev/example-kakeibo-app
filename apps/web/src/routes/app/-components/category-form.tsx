import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4-mini";
import type { Category, TransactionType } from "@example-kakeibo-app/contract";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRESET_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"];

/** カテゴリ追加・編集フォーム */
export function CategoryForm({
  editing,
  type,
  onSubmit,
  onCancel,
  isPending,
}: {
  editing: Category | null;
  type: TransactionType;
  onSubmit: (data: { name: string; color?: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const form = useForm({
    defaultValues: {
      name: editing?.name ?? "",
      color: editing?.color ?? PRESET_COLORS[0]!,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
    validators: {
      onSubmit: z.object({
        name: z.string().check(z.minLength(1, "カテゴリ名は必須です")),
        color: z.string(),
      }),
    },
  });

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 text-sm font-medium">
        {editing ? "カテゴリ編集" : `${type === "expense" ? "支出" : "収入"}カテゴリ追加`}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-3"
      >
        <form.Field name="name">
          {(field) => (
            <div className="space-y-1">
              <Label>名前</Label>
              <Input
                placeholder="食費、給与など"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="color">
          {(field) => (
            <div className="space-y-1">
              <Label>色</Label>
              <div className="flex gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`size-6 rounded-full border-2 ${
                      field.state.value === color ? "border-primary" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => field.handleChange(color)}
                  />
                ))}
              </div>
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
