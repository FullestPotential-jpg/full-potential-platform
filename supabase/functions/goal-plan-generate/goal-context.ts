export interface GoalContext {
  hours_per_week: string;
  past_blockers: string;
  energy_level: number;
  support_resources: string;
  stakes_if_fail: string;
  target_deadline: string;
  situation_access: string;
}

export function parseGoalContext(
  body: Record<string, unknown>,
): GoalContext | null {
  const hours = String(body.hours_per_week ?? "").trim().slice(0, 40);
  const blockers = String(body.past_blockers ?? "").trim().slice(0, 2000);
  const help = String(body.support_resources ?? "").trim().slice(0, 2000);
  const stakes = String(body.stakes_if_fail ?? "").trim().slice(0, 2000);
  const deadline = String(body.target_deadline ?? "").trim().slice(0, 120);
  const situation = String(body.situation_access ?? "").trim().slice(0, 2000);
  const energy = Number(body.energy_level);

  const hoursNum = parseFloat(hours.replace(",", "."));
  if (!hours || !Number.isFinite(hoursNum) || hoursNum < 0.5 || hoursNum > 168) {
    return null;
  }
  const textMin = 20;
  if (
    blockers.length < textMin || help.length < textMin ||
    stakes.length < textMin || situation.length < textMin
  ) {
    return null;
  }
  if (deadline.length < 5) return null;
  if (!Number.isFinite(energy) || energy < 1 || energy > 10) return null;

  return {
    hours_per_week: hours,
    past_blockers: blockers,
    energy_level: Math.round(energy),
    support_resources: help,
    stakes_if_fail: stakes,
    target_deadline: deadline,
    situation_access: situation,
  };
}
