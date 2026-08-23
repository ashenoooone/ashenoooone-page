import type { Lang, UiKey } from '../i18n/ui'
import type { Accent } from '../lib/accents'
import { swapLang } from '../i18n/ui'

export interface NavItem {
  /** Путь без локали; префикс локали добавляется при сборке ссылки. */
  href: string
  key: UiKey
}

export interface SocialLink {
  label: string
  href: string
  accent: Accent
  /** Ключ логотипа в реестре иконок; без него рядом со ссылкой встанет точка. */
  icon?: string
}

export interface LocaleContent {
  title: string
  /** Должность строкой: идёт в `jobTitle` разметки Person. */
  jobTitle: string
  description: string
  /** Превью для соцсетей, лежит в `public`; рисуется `scripts/og.mjs`. */
  ogImage: string
  socials: SocialLink[]
}

/** Значения, которые читаются одинаково на любом языке. */
export const site = {
  wordmark: 'rg',
  email: 'ashen.one.dev@yandex.com',
  year: 2026,

  nav: [
    { href: '/blog', key: 'nav.blog' },
    { href: '/projects', key: 'nav.projects' },
  ] satisfies NavItem[],
}

export const siteContent: Record<Lang, LocaleContent> = {
  ru: {
    title: 'Роман Гонтарь',
    jobTitle: 'Frontend-разработчик',
    ogImage: '/og.png',
    description:
      'Frontend-разработчик. {{experience}} собираю интерфейсы, которым нельзя тормозить.',
    socials: [
      { label: 'GitHub', href: 'https://github.com/ashenoooone', accent: 'silver', icon: 'github' },
      { label: 'Telegram', href: 'https://t.me/ashenoooone', accent: 'blue', icon: 'telegram' },
      { label: 'Хабр', href: 'https://habr.com/ru/users/ashenoooone/', accent: 'green', icon: 'habr' },
    ],
  },
  en: {
    title: 'Roman Gontar',
    jobTitle: 'Frontend developer',
    ogImage: '/og-en.png',
    description:
      'Frontend developer. {{experience}} of building interfaces that are not allowed to be slow.',
    socials: [
      { label: 'GitHub', href: 'https://github.com/ashenoooone', accent: 'silver', icon: 'github' },
      { label: 'Telegram', href: 'https://t.me/ashenoooone', accent: 'blue', icon: 'telegram' },
      { label: 'Habr', href: 'https://habr.com/ru/users/ashenoooone/', accent: 'green', icon: 'habr' },
    ],
  },
}

/**
 * Добавляет к пути base из конфига Astro, чтобы ссылки выжили на Pages.
 * Каталоги получают завершающий слеш: без него base-корень (`/ashenoooone-page`)
 * не резолвится в dev, а на Pages каждый переход стоит лишнего редиректа.
 * Файлы (`/rss.xml`, `/favicon.svg`) остаются как есть.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (/^(?:https?:|mailto:|tel:|#)/.test(path))
    return path
  const clean = path.replace(/^\//, '').replace(/\/$/, '')
  if (!clean)
    return `${base}/`
  const isFile = clean.split('/').pop()!.includes('.')
  return `${base}/${clean}${isFile ? '' : '/'}`
}

/** То же, что `url()`, но ещё переводит путь в заданный язык. */
export function localeUrl(path: string, lang: Lang): string {
  if (/^(?:https?:|mailto:|tel:|#)/.test(path))
    return path
  return url(swapLang(path, lang))
}
