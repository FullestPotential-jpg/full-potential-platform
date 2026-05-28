import { clampWeekCount } from "./plan-schedule.ts";

/** Approximate week count from free-text deadline (ru/en). */
export function parseStatedDeadlineWeeks(
  deadline: string,
  _lang: string,
): number | null {
  const t = deadline.toLowerCase().trim();
  if (!t) return null;

  const weekMatch = t.match(/(\d+)\s*(?:недел|нед\.?|weeks?|wks?)\b/);
  if (weekMatch) return clampWeekCount(parseInt(weekMatch[1], 10));

  const monthMatch = t.match(
    /(\d+)\s*(?:месяц|месяца|месяцев|мес\.?|months?|mo\.?)\b/,
  );
  if (monthMatch) {
    return clampWeekCount(Math.round(parseInt(monthMatch[1], 10) * 4.33));
  }

  if (/(?:полгода|пол года|six\s*months|6\s*months|шесть\s*месяц)/.test(t)) {
    return clampWeekCount(26);
  }
  if (/(?:год|year|twelve\s*months|12\s*months|двенадцать\s*месяц)/.test(t)) {
    return clampWeekCount(52);
  }
  if (/(?:квартал|quarter|3\s*months|три\s*месяц)/.test(t)) {
    return clampWeekCount(13);
  }
  if (/(?:лето|summer)/.test(t)) return clampWeekCount(12);
  if (/(?:осень|autumn|fall)/.test(t)) return clampWeekCount(13);
  if (/(?:зим|winter)/.test(t)) return clampWeekCount(12);
  if (/(?:весн|spring)/.test(t)) return clampWeekCount(12);

  return null;
}

export function resolveTargetPlanWeeks(
  deadline: string,
  lang: string,
): { target: number; parsed: number | null } {
  const parsed = parseStatedDeadlineWeeks(deadline, lang);
  const target = parsed != null ? parsed : 8;
  return { target, parsed };
}
