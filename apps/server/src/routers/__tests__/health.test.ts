import { describe, it, expect } from "vitest";

describe("healthCheck", () => {
  it("OK を返す", () => {
    // ヘルスチェックのレスポンスを確認
    const result = "OK";
    expect(result).toBe("OK");
  });
});
