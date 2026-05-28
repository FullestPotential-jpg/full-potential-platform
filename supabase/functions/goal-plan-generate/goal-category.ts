/** Short coaching hint by goal type — helps the model pick a proven route. */
export function detectGoalCategoryHint(goal: string, lang: string): string {
  const t = goal.toLowerCase().replace(/ё/g, "е");

  if (/здоров|вес|фитнес|спорт|трениров|marathon|health|fitness|weight/.test(t)) {
    return lang === "en"
      ? "Category: HEALTH — weekly habits, measurable body/performance metrics, recovery."
      : "Категория: ЗДОРОВЬЕ — привычки по неделям, измеримые показатели, восстановление.";
  }
  if (/деньг|доход|бизнес|клиент|продаж|career|job|salary|money|business/.test(t)) {
    return lang === "en"
      ? "Category: CAREER/MONEY — pipeline, skills, artifacts (CV, offer, revenue)."
      : "Категория: КАРЬЕРА/ДЕНЬГИ — воронка, навыки, артефакты (резюме, оффер, выручка).";
  }
  if (/отношен|семь|партнер|друг|relationship|family/.test(t)) {
    return lang === "en"
      ? "Category: RELATIONSHIPS — concrete conversations, boundaries, rituals."
      : "Категория: ОТНОШЕНИЯ — конкретные разговоры, границы, ритуалы.";
  }
  if (/учи|курс|экзам|язык|навык|learn|study|guitar|skill/.test(t)) {
    return lang === "en"
      ? "Category: LEARNING — practice reps, checkpoints, demo artifacts."
      : "Категория: ОБУЧЕНИЕ — повторения, контрольные точки, демо-результат.";
  }
  return lang === "en"
    ? "Category: GENERAL — decompose into weekly measurable outcomes."
    : "Категория: ОБЩАЯ — разбей на измеримые недельные результаты.";
}
