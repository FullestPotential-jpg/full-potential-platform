/** Уникальная база для планов целей — по каждому из 8 архетипов (не 4 legacy-типа). */
export const ARCHETYPE_GOAL_KB_RU: Record<string, string> = {
  "amygdala-dopamine-control": `ПРОВИДЕЦ (amygdala-dopamine-control)
Суть: видит будущее целыми образами, горит новыми идеями, требует контроля над реализацией видения.
Сильные стороны для целей: прорывные концепции, стратегическое видение, создание «с нуля», вдохновение других картиной будущего.
Слепые зоны: нетерпимость к хаосу и чужим правкам; застревание в идее без MVP; делегирование «не тем» людям.
Стиль работы над целью: один яркий вектор + прототип/MVP за 1–2 недели, затем делегирование рутины; чёткие границы «я задаю направление — команда доводит».
Риски при планировании: слишком много параллельных идей; перфекционизм видения; конфликт с операционкой.
Что включать в план: фаза «кристаллизация видения» (1 страница/схема), фаза «MVP», фаза «передача на исполнение»; еженедельный мозговой штурм только по новому; метрика — один измеримый сигнал прогресса, не десять.
Советы: защищать автономию; не смешивать стратегию с бухгалтерией; партнёр с операционным/техническим типом для масштаба.`,

  "amygdala-dopamine-connection": `КОММУНИКАТОР (amygdala-dopamine-connection)
Суть: энергия от людей и признания, создаёт связи и смыслы, генерирует идеи в диалоге.
Сильные стороны: вовлечение других, публичность, эмоциональный драйв, нетворкинг, «продажа» смысла цели.
Слепые зоны: зависимость от обратной связи; провалы мотивации в изоляции; распыление на социальное без глубины.
Стиль работы: публичные обязательства (buddy, чат, эфир); короткие спринты с обратной связью; совместные сессии раз в неделю.
Риски: цель без «аудитории» гаснет; страх осуждения блокирует старт.
Что включать в план: шаги с людьми (созвон, пост, партнёр); ритуал еженедельного отчёта кому-то; канал поддержки из ответа «кто поможет».
Советы: не уходить в полную изоляцию; превратить цель в историю, которую можно рассказывать; закрепить 1–2 союзника.`,

  "amygdala-serotonin-control": `НОМАД (amygdala-serotonin-control)
Суть: внутренние ландшафты и смыслы, личные системы гармонии, панически избегает внешнего контроля.
Сильные стороны: глубина, самостоятельность, нестандартные решения, устойчивость в одиночной работе.
Слепые зоны: саботаж при жёстких дедлайнах «сверху»; уход в перфекционизм смысла без действия; конфликт с корпоративными рамками.
Стиль работы: гибкий график, личное пространство, цель как «личный проект» с выбираемыми правилами; микрошаги без давления толпы.
Риски: изоляция + откладывание; отказ от помощи; срыв при внезапных внешних требованиях.
Что включать в план: автономные слоты времени; минимум обязательных встреч; рефлексия (дневник) как инструмент, не наказание.
Советы: договориться с собой о мягких, но фиксированных ритуалах; ниша/формат без микроменеджмента.`,

  "amygdala-serotonin-connection": `ПОСРЕДНИК (amygdala-serotonin-connection)
Суть: чувствует скрытые связи и климат в системе, восстанавливает гармонию, истощается в конфликтах.
Сильные стороны: дипломатия, эмпатия, доверие, сглаживание сопротивлений на пути к цели.
Слепые зоны: избегание жёстких решений; перегруз от чужих эмоций; затягивание из-за стремления всем угодить.
Стиль работы: спокойная среда; поэтапные согласования; партнёр для «жёстких» задач; защита границ.
Риски: токсичное окружение съедает энергию; цель требует конфликта — паралич.
Что включать в план: шаги по снижению конфликтности среды; явные границы; один «твёрдый» союзник для неприятных дел.
Советы: не брать роль единственного медиатора в агрессивной среде; планировать восстановление после стрессовых контактов.`,

  "hippocampus-dopamine-control": `СТРАТЕГ (hippocampus-dopamine-control)
Суть: многоходовые схемы, интеллектуальные вызовы, прогноз рисков; теряет опору вне плана.
Сильные стороны: анализ, декомпозиция, сценарии, KPI, долгосрочная траектория.
Слепые зоны: паралич анализом; игнор нелогичного «человеческого фактора»; жёсткость при изменении условий.
Стиль работы: дорожная карта с ветвлениями; еженедельный пересмотр гипотез; 2–3 ключевые метрики.
Риски: план без действия; перегруз деталями; срыв при спонтанности.
Что включать в план: фаза исследования с дедлайном «решение за N дней»; таблица рисков; Plan B; шаги с датами.
Советы: лимит времени на анализ; включить «неидеальное» действие в first_week; учесть эмоции и поддержку из контекста.`,

  "hippocampus-dopamine-connection": `ПИОНЕР (hippocampus-dopamine-connection)
Суть: покоряет новое по плану, но нужна команда как опора; сила в организованной экспансии.
Сильные стороны: лидерство в новых условиях, мобилизация группы, амбиция + расчёт.
Слепые зоны: провал без команды; зависимость от единомышленников; потеря курса в одиночестве.
Стиль работы: цель как «экспедиция» — роли в команде, общий ритм, короткие победы для группы.
Риски: старт без союзников; распад группы; перегруз лидером всего подряд.
Что включать в план: шаги по набору/укреплению 2–3 союзников; общие чекпоинты; делегирование по типам личности.
Советы: из ответа «кто поможет» — конкретные роли; не вести всё solo; публичный командный якорь.`,

  "hippocampus-serotonin-control": `ИНЖЕНЕР (hippocampus-serotonin-control)
Суть: точность, процессы, оптимизация; разрушается от приблизительности и творческого хаоса.
Сильные стороны: системы, чеклисты, метрики качества, итеративное улучшение.
Слепые зоны: застревание в настройке процесса; непереносимость нечётких критериев; перфекционизм деталей.
Стиль работы: чёткие критерии «готово», таймбоксы, стандартизированные ритуалы, один поток задач.
Риски: бесконечная подготовка; цель без измеримых критериев; хаотичная среда.
Что включать в план: Definition of Done; трекер привычек/метрик; пошаговые регламенты; малые релизы.
Советы: ограничить время на «настройку»; 80% качества для старта; среда с ясными правилами.`,

  "hippocampus-serotonin-connection": `ХРАНИТЕЛЬ (hippocampus-serotonin-connection)
Суть: стабильные системы для «своих», традиции, лояльность; больно от предательства и распада группы.
Сильные стороны: последовательность, надёжность, долгий горизонт, защита достигнутого.
Слепые зоны: медленная адаптация к резким изменениям; сопротивление «революциям»; застревание в зоне комфорта.
Стиль работы: постепенные шаги, ритуалы, привязка цели к ценностям и близким; предсказуемый недельный ритм.
Риски: страх перемен; цель требует резкого разрыва — саботаж; перегруз заботой о других.
Что включать в план: мягкая эскалация; этапы адаптации; опора на «своих» из поддержки; закрепление привычек 21+ дней.
Советы: не ломать всё сразу; связать ставки через год с защитой важного; малые стабильные победы.`,
};

export const ARCHETYPE_GOAL_KB_EN: Record<string, string> = {
  "amygdala-dopamine-control": `SEER (amygdala-dopamine-control)
Core: future as whole images, burns with new ideas, needs control over how the vision is executed.
Strengths for goals: breakthrough concepts, strategic vision, building from zero, inspiring others with a future picture.
Blind spots: low tolerance for chaos and others editing the vision; stuck in idea without MVP; wrong delegation.
Work style: one bold vector + MVP in 1–2 weeks, then delegate routine; clear boundary "I set direction — team delivers".
Planning risks: too many parallel ideas; vision perfectionism; fighting operations.
Plan must include: "crystallize vision" phase, MVP phase, handoff phase; weekly brainstorm only for what's new; one measurable signal, not ten.
Tips: protect autonomy; keep strategy separate from admin; partner with operational/technical types to scale.`,

  "amygdala-dopamine-connection": `COMMUNICATOR (amygdala-dopamine-connection)
Core: energy from people and recognition; weaves connections and meaning; ideas spark in dialogue.
Strengths: enrolling others, visibility, emotional drive, networking, "selling" the goal's meaning.
Blind spots: dependency on feedback; motivation crash in isolation; shallow social spread without depth.
Work style: public commitments (buddy, chat, live check-in); short sprints with feedback; weekly co-working.
Risks: goal without an "audience" fades; fear of judgment blocks start.
Plan must include: steps with people (call, post, partner); weekly accountability to someone; use support from context answers.
Tips: avoid full isolation; turn the goal into a story you can tell; lock in 1–2 allies.`,

  "amygdala-serotonin-control": `NOMAD (amygdala-serotonin-control)
Core: inner landscapes and meaning, personal harmony systems; panics at external control.
Strengths: depth, self-sufficiency, unconventional solutions, solo endurance.
Blind spots: sabotage under imposed deadlines; meaning-perfectionism without action; clash with corporate frames.
Work style: flexible schedule, private space, goal as "personal project" with chosen rules; micro-steps without crowd pressure.
Risks: isolation + delay; refusing help; snap when externally pushed.
Plan must include: autonomous time slots; minimal mandatory meetings; reflection (journal) as tool not punishment.
Tips: soft but fixed rituals; niche/format without micromanagement.`,

  "amygdala-serotonin-connection": `MEDIATOR (amygdala-serotonin-connection)
Core: senses hidden ties and climate; restores harmony; drained by open conflict.
Strengths: diplomacy, empathy, trust, smoothing resistance toward the goal.
Blind spots: avoiding hard calls; overload from others' emotions; delay to please everyone.
Work style: calm environment; staged alignments; partner for "hard" tasks; boundary protection.
Risks: toxic surroundings drain energy; goal requires conflict — freeze.
Plan must include: steps to reduce environmental conflict; explicit boundaries; one "firm" ally for unpleasant tasks.
Tips: don't be the only mediator in aggressive settings; schedule recovery after stressful contacts.`,

  "hippocampus-dopamine-control": `STRATEGIST (hippocampus-dopamine-control)
Core: multi-move logic, intellectual challenge, risk forecast; unmoored when the system leaves the plan.
Strengths: analysis, decomposition, scenarios, KPIs, long trajectory.
Blind spots: analysis paralysis; ignoring illogical human factors; rigidity when conditions shift.
Work style: roadmap with branches; weekly hypothesis review; 2–3 key metrics.
Risks: plan without action; detail overload; break under spontaneity.
Plan must include: research phase with "decide by day N" deadline; risk table; Plan B; dated steps.
Tips: cap analysis time; include "imperfect" action in first_week; use emotions/support from context.`,

  "hippocampus-dopamine-connection": `PIONEER (hippocampus-dopamine-connection)
Core: conquers new ground with a plan but needs a team as anchor; strength is organized expansion.
Strengths: leadership in new terrain, mobilizing a group, ambition plus calculation.
Blind spots: collapse without a team; dependency on like-minded allies; doing everything as solo lead.
Work style: goal as "expedition" — roles, shared rhythm, short wins for the group.
Risks: start without allies; group falls apart; leader overload.
Plan must include: steps to recruit/strengthen 2–3 allies; shared checkpoints; delegation by personality type.
Tips: from "who can help" assign concrete roles; don't run everything solo; a public team anchor.`,

  "hippocampus-serotonin-control": `ENGINEER (hippocampus-serotonin-control)
Core: precision, processes, optimization; unsettled by vagueness and creative mess.
Strengths: systems, checklists, quality metrics, iterative improvement.
Blind spots: stuck tuning the process; vague success criteria; detail perfectionism.
Work style: clear Definition of Done, timeboxes, standardized rituals, one task stream.
Risks: endless prep; goal without measurable criteria; chaotic environment.
Plan must include: DoD, habit/metric tracker, step-by-step routines, small releases.
Tips: limit "setup" time; 80% quality to start; environment with clear rules.`,

  "hippocampus-serotonin-connection": `KEEPER (hippocampus-serotonin-connection)
Core: stable systems for "their people," tradition, loyalty; betrayal or group collapse hurts most.
Strengths: consistency, reliability, long horizon, protecting what's built.
Blind spots: slow adaptation to sudden change; resisting "revolutions"; comfort-zone stickiness.
Work style: gradual steps, rituals, tie goal to values and close people; predictable weekly rhythm.
Risks: fear of change; goal needs sharp break — self-sabotage; overload caring for others.
Plan must include: gentle escalation; adaptation stages; lean on "their people" from support; habit anchoring 21+ days.
Tips: don't break everything at once; link yearly stakes to protecting what matters; small stable wins.`,
};

export function getArchetypeGoalKb(
  lang: string,
  archetypeKey: string,
): string {
  const kb = lang === "en" ? ARCHETYPE_GOAL_KB_EN : ARCHETYPE_GOAL_KB_RU;
  return kb[archetypeKey] || "";
}
