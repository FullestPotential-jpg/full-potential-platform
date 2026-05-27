import type { GoalContext } from "./goal-context.ts";

export const TIMELINE_JSON_FIELDS = `
  "recommended_weeks": number (2-12, your realistic choice),
  "recommended_timeline": "short label e.g. 12 weeks / 12 недель",
  "timeline_message": "one sentence comparing user deadline vs your plan"`;

export const MASTER_PLAN_JSON_SCHEMA = `{
  "title": "string",
  "goal_rewritten": "string or null — SMART version of goal if original was vague, else null",
  "success_criteria": "string — 1-2 sentences: how we know the goal is achieved (measurable)",
  "barrier_protocol": "string — 3-4 lines: IF user's main barrier THEN within 2h do X ELSE Y (use barrier text)",
  "intro": "string — 5-8 sentences master strategy (big picture)",
  "milestones": [{ "name": "string", "weeks_label": "string e.g. weeks 1-3", "focus": "string — outcome of this stage" }],
  "first_48h": ["string — exactly 2-3 chained actions: step2 needs artifact from step1"],
  "recommended_weeks": number,
  "recommended_timeline": "string",
  "timeline_message": "string",
  "phases": [{
    "name": "string — week theme",
    "week_focus": "string — ONE main outcome this week",
    "week_success": "string — measurable end-of-week check (number or yes/no)",
    "tomorrow_step": "string — ONE concrete step for tomorrow: WHEN + WHERE + N min + Done when",
    "milestone": "string — which milestone name this week serves",
    "steps": ["string — exactly 3 unique steps with anchors"],
    "if_slip": "string — same-day recovery if barrier hits"
  }],
  "archetype_tips": ["string — 3 mini-tasks tied to archetype + goal"],
  "first_week": []
}`;

export const STEP_ANCHOR_RULES = `
STEP ANCHORS (every step and tomorrow_step):
- WHO/WHERE: place or app; use support names from context verbatim when relevant.
- DURATION: explicit minutes (e.g. 25 min), not "some time".
- Done when: one tangible artifact (file, message sent, log entry, photo, checklist tick).`;

export const MASTER_PLAN_RULES_EN = `
MASTER PLAN — TWO LAYERS:
A) STRATEGY (intro, milestones, success_criteria, barrier_protocol): big picture only.
B) EXECUTION (each week): week_success + tomorrow_step + 3 anchored steps.

RULES:
1) SMART goal; goal_rewritten if vague. success_criteria = final measurable state.
2) barrier_protocol: 3-4 lines — IF barrier from context THEN within 2h do X ELSE Y (plan-level, once).
3) milestones: exactly 3 stages covering all weeks.
4) first_48h: 2-3 actions in a CHAIN (step 2 impossible without step 1 artifact).
5) Each week: week_focus + week_success (Friday check, numeric/binary); tomorrow_step = smallest next action; exactly 3 steps; total minutes ≤ hours/week.
6) if_slip: same-day recovery tied to barrier.
7) ${STEP_ANCHOR_RULES}
8) 4-8 weeks only. User deadline only for timeline_message.`;

export const MASTER_PLAN_RULES_RU = `
ПЛАН — ДВА СЛОЯ:
А) СТРАТЕГИЯ (intro, milestones, success_criteria, barrier_protocol): общая картина.
Б) ИСПОЛНЕНИЕ (каждая неделя): week_success + tomorrow_step + 3 шага с якорями.

ПРАВИЛА:
1) SMART; goal_rewritten если размыто. success_criteria = измеримый финал.
2) barrier_protocol: 3-4 строки — ЕСЛИ барьер из анкеты ТО в течение 2 ч X ИНАЧЕ Y (один раз на план).
3) milestones: ровно 3 этапа на весь план.
4) first_48h: 2-3 действия ЦЕПОЧКОЙ (шаг 2 без артефакта шага 1 невозможен).
5) Каждая неделя: week_focus + week_success (проверка в пятницу, число/да-нет); tomorrow_step = минимальный шаг на завтра; ровно 3 шага; сумма минут ≤ часов/нед.
6) if_slip: восстановление в тот же день под барьер.
7) ${STEP_ANCHOR_RULES}
8) Только 4-8 недель. Срок пользователя — только timeline_message.`;

export function buildDeadlineReferenceBlock(
  lang: string,
  ctx: GoalContext,
): string {
  if (lang === "en") {
    return `
USER'S STATED DEADLINE (reference only — do NOT use as plan length):
"${ctx.target_deadline}"
You choose week count from goal complexity, ${ctx.hours_per_week} h/week MAX for all steps combined, energy ${ctx.energy_level}/10, barrier, archetype.
Every phase = ONE week. ${TIMELINE_JSON_FIELDS}`;
  }
  return `
СРОК ПОЛЬЗОВАТЕЛЯ (только для сравнения — НЕ длина плана):
«${ctx.target_deadline}»
Число недель — по цели, максимум ${ctx.hours_per_week} ч/нед на все шаги недели, энергия ${ctx.energy_level}/10, барьер, архетип.
Каждый phases[] = одна неделя. ${TIMELINE_JSON_FIELDS}`;
}

export const ANTI_DUPLICATE_RULES = `
UNIQUENESS (mandatory):
- Every step in every week must be NEW — never copy-paste the same step text across weeks.
- If a habit repeats, escalate it (week 1: 5 min → week 4: 15 min) with different actions and "Done when" criteria.`;

export const PLAN_QUALITY_RULES_EN = MASTER_PLAN_RULES_EN;
export const PLAN_QUALITY_RULES_RU = MASTER_PLAN_RULES_RU;
