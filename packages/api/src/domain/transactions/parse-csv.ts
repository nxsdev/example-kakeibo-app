export type CsvRow = {
  date: string;
  type: string;
  category_name: string;
  category_type: string;
  amount: string;
  note: string;
};

/** CSV文字列をパースして行配列を返す */
export function parseCsv(csv: string): CsvRow[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0]!.split(",").map((h) => h.trim());
  const expectedHeaders = ["date", "type", "category_name", "category_type", "amount", "note"];

  // ヘッダー検証
  if (header.length !== expectedHeaders.length) {
    throw new CsvParseError("CSVヘッダーが不正です。期待: " + expectedHeaders.join(","));
  }
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (header[i] !== expectedHeaders[i]) {
      throw new CsvParseError(
        `CSVヘッダーが不正です。カラム${i + 1}: 期待="${expectedHeaders[i]}", 実際="${header[i]}"`,
      );
    }
  }

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return {
      date: values[0] ?? "",
      type: values[1] ?? "",
      category_name: values[2] ?? "",
      category_type: values[3] ?? "",
      amount: values[4] ?? "",
      note: values[5] ?? "",
    };
  });
}

export class CsvParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CsvParseError";
  }
}
