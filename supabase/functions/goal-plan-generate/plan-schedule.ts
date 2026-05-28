/** Weekly plan bounds — aligned with user's stated horizon (capped for reliable generation). */
export const MIN_PLAN_WEEKS = 2;
export const MAX_PLAN_WEEKS = 16;

export function clampWeekCount(n: number): number {
  if (!Number.isFinite(n)) return 8;
  return Math.min(MAX_PLAN_WEEKS, Math.max(MIN_PLAN_WEEKS, Math.round(n)));
}
