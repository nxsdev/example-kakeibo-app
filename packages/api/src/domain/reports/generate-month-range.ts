/** 指定月から過去N ヶ月の "YYYY-MM" 配列を生成する（当月含む） */
export function generateMonthRange(baseMonth: string, count: number): string[] {
  const [year, month] = baseMonth.split("-").map(Number) as [number, number];
  const months: string[] = [];

  for (let i = 0; i < count; i++) {
    let y = year;
    let m = month - i;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    months.push(`${y}-${String(m).padStart(2, "0")}`);
  }

  return months;
}

/** 指定月の前月を返す */
export function getPreviousMonth(month: string): string {
  const [year, m] = month.split("-").map(Number) as [number, number];
  if (m === 1) return `${year - 1}-12`;
  return `${year}-${String(m - 1).padStart(2, "0")}`;
}

/** 現在の月を "YYYY-MM" で返す */
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
