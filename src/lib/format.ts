import type { Lang } from '../i18n/ui'

const LOCALE: Record<Lang, string> = {
  ru: 'ru-RU',
  en: 'en-GB',
}

/**
 * Даты в контенте — простые `YYYY-MM-DD`, то есть полночь UTC. Форматирование
 * в зоне сборочной машины сдвинуло бы половину из них на день назад, поэтому
 * каждый форматтер ниже прибит к UTC.
 */
const UTC = { timeZone: 'UTC' } as const

/**
 * Русские короткие месяцы выписаны руками: `Intl` возвращает «июль» и «июнь»
 * целиком, что ломает трёхбуквенную колонку, на которую рассчитан дизайн.
 */
const RU_SHORT_MONTHS = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
]

/** `авг 26` / `aug 26` — правая колонка строки заметки. */
export function formatMonthYear(date: Date, lang: Lang): string {
  const month
    = lang === 'ru'
      ? RU_SHORT_MONTHS[date.getUTCMonth()]!
      : new Intl.DateTimeFormat(LOCALE[lang], { month: 'short', ...UTC })
          .format(date)
          .replace(/\.$/, '')
          .toLowerCase()

  return `${month} ${String(date.getUTCFullYear()).slice(2)}`
}

/** `14 августа 2026` / `14 August 2026` — подпись под заголовком заметки. */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...UTC,
  })
    .format(date)
    .replace(/\s*г\.$/, '')
}

/** День в ISO — для `<time datetime>` и фида. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const WORDS_PER_MINUTE = 180

/**
 * Минуты чтения markdown-исходника. Блоки кода, ссылки и символы разметки
 * сначала выбрасываются, чтобы заметка с кучей кода не считалась прозой.
 */
export function readingMinutes(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|-]/g, ' ')

  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
