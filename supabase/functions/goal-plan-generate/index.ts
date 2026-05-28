import {
  ARCHETYPE_EXECUTION_GUIDE_RU,
  EXECUTABLE_STEP_RULES_RU,
} from "./archetype-execution-guide-ru.ts";
import { GOAL_COACH_JSON_RULES_RU } from "./coach-knowledge-ru.ts";
import { getArchetypeGoalKb } from "./archetype-kb.ts";
import { type GoalContext, parseGoalContext } from "./goal-context.ts";
import { detectGoalCategoryHint } from "./goal-category.ts";
import {
  ANTI_DUPLICATE_RULES,
  buildDeadlineReferenceBlock,
  MASTER_PLAN_JSON_SCHEMA,
  MASTER_PLAN_RULES_EN,
  MASTER_PLAN_RULES_RU,
  PLAN_QUALITY_RULES_EN,
  PLAN_QUALITY_RULES_RU,
  buildSituationAccessBlock,
} from "./plan-prompts.ts";
import { resolveTargetPlanWeeks } from "./plan-deadline.ts";
import {
  clampWeekCount,
  MAX_PLAN_WEEKS,
  MIN_PLAN_WEEKS,
} from "./plan-schedule.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface PlanMilestone {
  name: string;
  weeks_label?: string;
  focus: string;
}

interface PlanPhase {
  name: string;
  duration?: string;
  week_focus?: string;
  week_success?: string;
  tomorrow_step?: string;
  milestone?: string;
  steps: string[];
  if_slip?: string;
}

interface GoalPlan {
  title: string;
  intro: string;
  goal_rewritten?: string | null;
  success_criteria?: string;
  barrier_protocol?: string;
  milestones?: PlanMilestone[];
  first_48h?: string[];
  phases: PlanPhase[];
  archetype_tips: string[];
  first_week: string[];
  phase_unit?: "week";
  user_stated_deadline?: string;
  recommended_weeks?: number;
  recommended_timeline?: string;
  timeline_message?: string;
}

function buildSystemPrompt(lang: string): string {
  if (lang === "en") {
    const kb = getArchetypeGoalKb("en", "") ||
      "Use the eight archetypes: Seer, Strategist, Engineer, Keeper, Communicator, Mediator, Nomad, Pioneer.";
    return `You are a goal-achievement expert on Full Potentiall. Write the entire plan in English.

${kb}

${PLAN_QUALITY_RULES_EN}
${ANTI_DUPLICATE_RULES}

CORE LOGIC:
STEP 1 — Best general path to THIS exact goal (ignore archetype first).
STEP 2 — Adapt for archetype + user context (6 answers).

Each phases[] item = ONE week. Plan length MUST match the user's stated horizon (see user prompt).
If the full outcome is unrealistic in that time, keep all weeks but set honest success_criteria and timeline_message.

EXECUTABLE STEP CONTRACT — every step: WHEN + ACTION + TOOL + DURATION + "Done when:".
first_week = always [].

Respond ONLY with valid JSON:
${MASTER_PLAN_JSON_SCHEMA}`;
  }

  return (
    GOAL_COACH_JSON_RULES_RU +
    "\n\n" +
    EXECUTABLE_STEP_RULES_RU +
    "\n\n" +
    ARCHETYPE_EXECUTION_GUIDE_RU.slice(0, 1600) +
    "\n\n" +
    PLAN_QUALITY_RULES_RU +
    "\n\n" +
    ANTI_DUPLICATE_RULES
  );
}

function buildUserPrompt(
  lang: string,
  goal: string,
  archetypeName: string,
  archetypeKey: string,
  archetypeProfile: string,
  ctx: GoalContext,
): string {
  const horizon = resolveTargetPlanWeeks(ctx.target_deadline, lang);
  const deadlineBlock = buildDeadlineReferenceBlock(
    lang,
    ctx,
    horizon.target,
    horizon.parsed,
  );
  const situationBlock = buildSituationAccessBlock(lang, ctx);
  const categoryHint = detectGoalCategoryHint(goal, lang);
  const profileExtra = archetypeProfile
    ? (lang === "en"
      ? `\n\nOptional supplement from app:\n${archetypeProfile.slice(0, 2000)}`
      : `\n\nДополнение из приложения:\n${archetypeProfile.slice(0, 2000)}`)
    : "";

  if (lang === "en") {
    return `USER GOAL:
${goal}

ARCHETYPE: ${archetypeName} (${archetypeKey})

CONTEXT:
- Hours per week: ${ctx.hours_per_week}
- Main barrier: ${ctx.past_blockers}
- Energy: ${ctx.energy_level}/10
- Support: ${ctx.support_resources}
- Stakes: ${ctx.stakes_if_fail}
${deadlineBlock}
${situationBlock}
${categoryHint}
${profileExtra}`;
  }

  return `ЦЕЛЬ:
${goal}

АРХЕТИП: ${archetypeName} (${archetypeKey})

КОНТЕКСТ:
- Часов в неделю: ${ctx.hours_per_week}
- Барьер: ${ctx.past_blockers}
- Энергия: ${ctx.energy_level}/10
- Опора: ${ctx.support_resources}
- Цена бездействия: ${ctx.stakes_if_fail}
${deadlineBlock}
${situationBlock}
${categoryHint}

ВАЖНО:
- Имена из «Опора» в шагах дословно.
- intro: 5–8 предложений, мастерский план под архетип.
- Шаги уникальны по неделям — без копипаста.
${profileExtra}`;
}

type OpenRouterResult =
  | { ok: true; plan: Partial<GoalPlan> }
  | { ok: false; error: string; status?: number };

async function callOpenRouterForPlan(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
): Promise<OpenRouterResult> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": Deno.env.get("OPENROUTER_SITE_URL")?.trim() ||
        "https://fullestpotential-jpg.github.io",
      "X-Title": "Full Potentiall",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[goal-plan-generate] OpenRouter error", res.status, errText);
    return { ok: false, error: "openrouter_error", status: res.status };
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== "string") {
    return { ok: false, error: "empty_response" };
  }

  try {
    return { ok: true, plan: JSON.parse(raw) as Partial<GoalPlan> };
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false, error: "invalid_plan_json" };
    try {
      return { ok: true, plan: JSON.parse(match[0]) as Partial<GoalPlan> };
    } catch {
      return { ok: false, error: "invalid_plan_json" };
    }
  }
}

function normalizeStepKey(step: string): string {
  return step.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 100);
}

const VAGUE_STEP_RE =
  /будьте мотивирован|будь мотивирован|stay motivated|be motivated|найди время|find time|будь последователен|stay consistent|используй сильные стороны|use your strengths/i;

function hasVagueSteps(plan: GoalPlan): boolean {
  for (const ph of plan.phases) {
    for (const s of ph.steps || []) {
      if (VAGUE_STEP_RE.test(s)) return true;
    }
  }
  for (const s of plan.first_48h || []) {
    if (VAGUE_STEP_RE.test(s)) return true;
  }
  return false;
}

function hasDuplicateSteps(plan: GoalPlan): boolean {
  const seen = new Set<string>();
  for (const ph of plan.phases) {
    for (const s of ph.steps || []) {
      const key = normalizeStepKey(s);
      if (key.length < 12) continue;
      if (seen.has(key)) return true;
      seen.add(key);
    }
  }
  return false;
}

function ensureTimelineFields(
  plan: GoalPlan,
  ctx: GoalContext,
  lang: string,
): void {
  const weeks = plan.phases.length;
  plan.recommended_weeks = clampWeekCount(
    Number(plan.recommended_weeks) || weeks,
  );
  if (!plan.recommended_timeline?.trim()) {
    plan.recommended_timeline = lang === "en"
      ? `${weeks} weeks`
      : `${weeks} недель`;
  }
  if (!plan.timeline_message?.trim()) {
    plan.timeline_message = lang === "en"
      ? `You mentioned "${ctx.target_deadline}". A realistic path is ${plan.recommended_timeline} if you follow the weekly plan.`
      : `Вы указали срок «${ctx.target_deadline}». Реалистичный план: ${plan.recommended_timeline} — при выполнении шагов по неделям.`;
  }
}

function normalizeMasterPlan(plan: GoalPlan, ctx: GoalContext, lang: string): void {
  if (!Array.isArray(plan.milestones)) plan.milestones = [];
  if (!Array.isArray(plan.first_48h)) plan.first_48h = [];
  if (!plan.success_criteria?.trim()) {
    plan.success_criteria = plan.title || "";
  }
  if (plan.goal_rewritten === "" || plan.goal_rewritten === "null") {
    plan.goal_rewritten = null;
  }
  const barrierShort = ctx.past_blockers.slice(0, 80);
  if (!plan.barrier_protocol?.trim()) {
    plan.barrier_protocol = lang === "en"
      ? `IF "${barrierShort}" shows up → within 2 hours: 15 min minimum step from this week + message your support. ELSE: continue the planned step.`
      : `ЕСЛИ барьер «${barrierShort}» → в течение 2 ч: 15 мин минимальный шаг недели + сообщение опоре. ИНАЧЕ: продолжить запланированный шаг.`;
  }
  const slipTpl = lang === "en"
    ? `If the barrier hits ("${barrierShort}"): same day, 15 min — smallest step from this week and message your support.`
    : `Если барьер («${barrierShort}»): в тот же день 15 мин — минимальный шаг из недели + сообщение опоре.`;
  for (const ph of plan.phases) {
    if (!ph.week_focus?.trim()) ph.week_focus = ph.name || "";
    if (!ph.week_success?.trim()) ph.week_success = ph.week_focus || "";
    if (!ph.tomorrow_step?.trim() && ph.steps?.[0]) {
      ph.tomorrow_step = ph.steps[0];
    }
    if (!ph.if_slip?.trim()) ph.if_slip = slipTpl;
  }
  if (plan.milestones.length < 2 && plan.phases.length >= 2) {
    const third = Math.ceil(plan.phases.length / 3);
    plan.milestones = [
      { name: lang === "en" ? "Start" : "Старт", weeks_label: `1-${third}`, focus: plan.phases[0]?.week_focus || "" },
      { name: lang === "en" ? "Build" : "Рост", weeks_label: `${third + 1}-${third * 2}`, focus: plan.phases[third]?.week_focus || "" },
      { name: lang === "en" ? "Finish" : "Финиш", weeks_label: `${third * 2 + 1}-${plan.phases.length}`, focus: plan.phases[plan.phases.length - 1]?.week_focus || "" },
    ];
  }
  if (plan.first_48h.length < 1 && plan.phases[0]?.steps?.[0]) {
    plan.first_48h = [plan.phases[0].steps[0]];
  }
}

function validatePlanShape(
  plan: GoalPlan,
  targetWeeks: number,
): string | null {
  if (!plan.title || !Array.isArray(plan.phases)) return "invalid_plan_shape";
  const weeks = plan.phases.length;
  if (weeks < MIN_PLAN_WEEKS || weeks > MAX_PLAN_WEEKS) {
    return "invalid_week_count";
  }
  if (Math.abs(weeks - targetWeeks) > 2) {
    return "invalid_week_count";
  }
  if (
    plan.recommended_weeks !== undefined &&
    Math.abs(plan.recommended_weeks - weeks) > 1
  ) {
    return "invalid_week_count";
  }
  if (!plan.success_criteria?.trim() || plan.success_criteria.length < 12) {
    return "invalid_plan_shape";
  }
  const ms = plan.milestones || [];
  if (ms.length > 0 && ms.length < 2) return "invalid_milestones";
  for (const ph of plan.phases) {
    if (!ph.name || !Array.isArray(ph.steps) || ph.steps.length < 2 ||
      ph.steps.length > 6) {
      return "invalid_phase_steps";
    }
  }
  if (!plan.intro?.trim() || plan.intro.length < 30) return "invalid_plan_shape";
  if (hasVagueSteps(plan)) return "vague_steps";
  if (hasDuplicateSteps(plan)) return "duplicate_steps";
  return null;
}

async function generateGoalPlan(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  ctx: GoalContext,
  lang: string,
): Promise<OpenRouterResult & { plan?: GoalPlan }> {
  const { target: targetWeeks } = resolveTargetPlanWeeks(ctx.target_deadline, lang);
  const weekLo = Math.max(MIN_PLAN_WEEKS, targetWeeks - 1);
  const weekHi = Math.min(MAX_PLAN_WEEKS, targetWeeks + 1);
  const fullSuffix = lang === "en"
    ? `\n\nOUTPUT: one JSON — COMPLETE plan. phases[] length MUST be ${targetWeeks} weeks (${weekLo}–${weekHi} only if unavoidable). Include barrier_protocol, first_48h chain. Each week: week_focus, week_success, tomorrow_step, milestone, exactly 3 anchored steps fitting user's situation_access, if_slip. first_week: []. Shape:\n${MASTER_PLAN_JSON_SCHEMA}\n\n${ANTI_DUPLICATE_RULES}`
    : `\n\nОТВЕТ: один JSON — полный план. phases[] — ровно ${targetWeeks} недель (допустимо ${weekLo}–${weekHi}). barrier_protocol, first_48h цепочкой. Каждая неделя: week_focus, week_success, tomorrow_step, milestone, ровно 3 шага под situation_access, if_slip. first_week: []. Структура:\n${MASTER_PLAN_JSON_SCHEMA}\n\n${ANTI_DUPLICATE_RULES}`;

  const started = Date.now();
  const res = await callOpenRouterForPlan(
    apiKey,
    model,
    systemPrompt,
    userPrompt + fullSuffix,
    6000,
  );
  console.log("[goal-plan-generate] one-shot ms=", Date.now() - started);
  if (!res.ok) return res;

  const p = res.plan as Partial<GoalPlan>;
  const plan: GoalPlan = {
    title: String(p.title || "").trim(),
    intro: String(p.intro || "").trim(),
    goal_rewritten: p.goal_rewritten ?? null,
    success_criteria: String(p.success_criteria || "").trim(),
    barrier_protocol: String(p.barrier_protocol || "").trim(),
    milestones: (p.milestones || []) as PlanMilestone[],
    first_48h: (p.first_48h || []) as string[],
    recommended_weeks: clampWeekCount(Number(p.recommended_weeks) || (p.phases?.length || 8)),
    recommended_timeline: String(p.recommended_timeline || ""),
    timeline_message: String(p.timeline_message || ""),
    phases: (p.phases || []) as PlanPhase[],
    archetype_tips: Array.isArray(p.archetype_tips)
      ? p.archetype_tips as string[]
      : [],
    first_week: [],
  };

  plan.recommended_weeks = clampWeekCount(plan.phases.length);

  normalizeMasterPlan(plan, ctx, lang);
  ensureTimelineFields(plan, ctx, lang);

  let err = validatePlanShape(plan, targetWeeks);
  if (err === "duplicate_steps" || err === "vague_steps") {
    console.warn("[goal-plan-generate] soft accept", err);
    err = null;
  }
  if (err) return { ok: false, error: err };
  return { ok: true, plan };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  const apiKey = Deno.env.get("OPENROUTER_API_KEY")?.trim() ||
    Deno.env.get("OPENAI_API_KEY")?.trim();
  if (!apiKey) {
    return json({ ok: false, error: "missing_openrouter_key" }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const goal = String(body.goal || "").trim().slice(0, 2000);
  const lang = body.lang === "en" ? "en" : "ru";
  const archetypeName = String(body.archetype_name || "").trim().slice(0, 120);
  const archetypeKey = String(body.archetype_key || "").trim().slice(0, 80);
  const archetypeProfile = String(body.archetype_profile || "").trim()
    .slice(0, 48000);

  const ctx = parseGoalContext(body);
  if (!ctx) {
    return json({ ok: false, error: "missing_context" }, 400);
  }

  if (goal.length < 3) {
    return json({ ok: false, error: "goal_too_short" }, 400);
  }
  if (!archetypeKey && !archetypeName && !archetypeProfile) {
    return json({ ok: false, error: "missing_archetype" }, 400);
  }

  const systemPrompt = buildSystemPrompt(lang);
  const userPrompt = buildUserPrompt(
    lang,
    goal,
    archetypeName,
    archetypeKey,
    archetypeProfile,
    ctx,
  );

  const model = Deno.env.get("OPENROUTER_MODEL")?.trim() ||
    "openai/gpt-4o-mini";

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const line = (obj: Record<string, unknown>) =>
        enc.encode(JSON.stringify(obj) + "\n");
      const tick = () => {
        try {
          controller.enqueue(line({ _: "h", t: Date.now() }));
        } catch {
          /* closed */
        }
      };
      tick();
      const iv = setInterval(tick, 10000);
      try {
        const generated = await generateGoalPlan(
          apiKey,
          model,
          systemPrompt,
          userPrompt,
          ctx,
          lang,
        );
        clearInterval(iv);
        if (!generated.ok || !generated.plan) {
          const err = generated.error || "server_error";
          controller.enqueue(
            line({
              _: "r",
              ok: false,
              error: err,
              status: "status" in generated ? generated.status : undefined,
            }),
          );
          controller.close();
          return;
        }
        const plan = generated.plan;
        plan.phase_unit = "week";
        plan.user_stated_deadline = ctx.target_deadline;
        plan.recommended_weeks = plan.phases.length;
        controller.enqueue(
          line({
            _: "r",
            ok: true,
            plan,
            profile_chars: archetypeProfile.length,
            week_count: plan.phases.length,
            phase_unit: "week",
          }),
        );
        controller.close();
      } catch (e) {
        clearInterval(iv);
        console.error("[goal-plan-generate]", e);
        try {
          controller.enqueue(line({ _: "r", ok: false, error: "server_error" }));
          controller.close();
        } catch {
          /* ignore */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
});
