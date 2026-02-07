import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn ユーティリティ", () => {
  it("クラス名を結合する", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("条件付きクラス名を処理する", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("Tailwind の重複クラスをマージする", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
