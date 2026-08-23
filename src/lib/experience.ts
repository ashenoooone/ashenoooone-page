import type { Lang } from '../i18n/ui'

/**
 * Начало карьеры. Стаж на сайте нигде не выписан словами — он считается
 * отсюда, чтобы цифра не расходилась с резюме через полгода после правки.
 */
export const CAREER_START = new Date('2022-02-01T00:00:00Z')

const TOKEN = /\{\{experience\}\}/g

/**
 * Месяцы так же, как их считает hh.ru: месяц начала и текущий месяц идут
 * как полные. Февраль 2022 — август 2026 даёт 55, то есть «4 года 7 месяцев».
 */
function monthsSince(from: Date, now: Date): number {
  const months
    = (now.getUTCFullYear() - from.getUTCFullYear()) * 12
      + (now.getUTCMonth() - from.getUTCMonth())
      + 1

  return Math.max(0, months)
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100

  if (mod10 === 1 && mod100 !== 11)
    return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
    return few
  return many
}

/** Стаж в формате hh.ru: «4 года 7 месяцев», `4 years 7 months`. */
export function experience(lang: Lang, now: Date = new Date()): string {
  const total = monthsSince(CAREER_START, now)
  const years = Math.floor(total / 12)
  const months = total % 12

  if (lang === 'en') {
    const parts: string[] = []

    if (years > 0)
      parts.push(`${years} year${years === 1 ? '' : 's'}`)
    if (months > 0 || years === 0)
      parts.push(`${months} month${months === 1 ? '' : 's'}`)

    return parts.join(' ')
  }

  const parts: string[] = []

  if (years > 0)
    parts.push(`${years} ${plural(years, 'год', 'года', 'лет')}`)
  if (months > 0 || years === 0)
    parts.push(`${months} ${plural(months, 'месяц', 'месяца', 'месяцев')}`)

  return parts.join(' ')
}

export function withExperience(text: string, lang: Lang, now?: Date): string {
  return text.replace(TOKEN, () => experience(lang, now))
}
