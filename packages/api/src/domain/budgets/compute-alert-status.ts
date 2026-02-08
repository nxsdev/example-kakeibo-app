import type { BudgetAlertStatus } from "@example-kakeibo-app/contract";

/** 予算のアラートステータスを算出する */
export function computeAlertStatus(
  spent: number,
  amount: number,
  threshold: number,
): BudgetAlertStatus {
  if (amount <= 0) return "none";
  const percentage = (spent / amount) * 100;
  if (percentage >= 100) return "exceeded";
  if (percentage >= threshold) return "warning";
  return "none";
}
