/** ダッシュボードのサマリーカード */
export function SummaryCard({
  title,
  value,
  icon,
  isCurrency = true,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  isCurrency?: boolean;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold">
        {isCurrency ? `${value.toLocaleString()}円` : value.toLocaleString()}
      </p>
    </div>
  );
}
