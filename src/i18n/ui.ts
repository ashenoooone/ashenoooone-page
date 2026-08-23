/**
 * Строки интерфейса. Всё, что читает посетитель и что *не* является
 * контентом, живёт здесь; сам контент лежит в `src/content` как markdown.
 */

export const LANGS = ['ru', 'en'] as const

export type Lang = (typeof LANGS)[number]

export const defaultLang: Lang = 'ru'

export const langLabel: Record<Lang, string> = {
  ru: 'RU',
  en: 'EN',
}

export const ui = {
  ru: {
    'nav.blog': 'Блог',
    'nav.projects': 'Проекты',
    'nav.home': 'На главную',
    'nav.sections': 'разделы',

    'theme.toggle': 'Переключить тему',

    'lang.switch': 'Switch to English',
    /* Подсказка показывается на странице другого языка, поэтому лежит в своей локали. */
    'lang.hint': 'Эта страница есть на русском.',
    'lang.hintOpen': 'Открыть',
    'lang.hintDismiss': 'Скрыть',

    'home.work': 'работа',
    'home.blog': 'блог',

    'projects.back': '← все проекты',
    'projects.next': 'дальше',
    'projects.role': 'роль',
    'projects.team': 'команда',
    'projects.stack': 'стек',
    'projects.period': 'сроки',
    'projects.gallery': 'как это выглядит',

    'blog.back': '← в блог',
    'blog.related': 'ещё по теме',
    'blog.readingTime': 'мин',
    'blog.empty': 'Пока пусто. Первая заметка по теме уже пишется.',
    'blog.emptyAll': 'Пока пусто. Первая заметка уже пишется.',
    'blog.topicLead': 'Заметки по теме «{topic}».',

    'cta.write': 'Написать мне',
    'cta.status': 'в активном поиске · отвечаю в тот же день',

    'meta.find': 'найти меня',
    'meta.email': 'почта',

    'rss.title': 'Блог. Роман Гонтарь',
    'rss.description':
      'Производительность, архитектура фронтенда и агенты в живой кодовой базе.',

    'notFound.title': 'Такой страницы нет',
    'notFound.lead':
      'Ссылка ведёт в пустоту: страницу переименовали, удалили или её никогда не было.',
    'notFound.body': 'Что точно на месте:',
  },
  en: {
    'nav.blog': 'Blog',
    'nav.projects': 'Projects',
    'nav.home': 'Home',
    'nav.sections': 'sections',

    'theme.toggle': 'Toggle theme',

    'lang.switch': 'Переключить на русский',
    'lang.hint': 'This page is also available in English.',
    'lang.hintOpen': 'Read it',
    'lang.hintDismiss': 'Dismiss',

    'home.work': 'work',
    'home.blog': 'blog',

    'projects.back': '← all projects',
    'projects.next': 'next',
    'projects.role': 'role',
    'projects.team': 'team',
    'projects.stack': 'stack',
    'projects.period': 'period',
    'projects.gallery': 'what it looks like',

    'blog.back': '← back to blog',
    'blog.related': 'more on this topic',
    'blog.readingTime': 'min',
    'blog.empty': 'Empty for now. The first note on this topic is being written.',
    'blog.emptyAll': 'Empty for now. The first note is being written.',
    'blog.topicLead': 'Notes on {topic}.',

    'cta.write': 'Write to me',
    'cta.status': 'actively looking · same-day reply',

    'meta.find': 'find me',
    'meta.email': 'email',

    'rss.title': 'Blog. Roman Gontar',
    'rss.description': 'Performance, frontend architecture and agents in a living codebase.',

    'notFound.title': 'No such page',
    'notFound.lead':
      'This link goes nowhere: the page was renamed, removed, or never existed.',
    'notFound.body': 'What is definitely still here:',
  },
} as const satisfies Record<Lang, Record<string, string>>

export type UiKey = keyof (typeof ui)['ru']

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key]
  }
}

/** `/en/blog` → `en`, всё остальное → `ru`. Путь должен быть без base. */
export function getLangFromPath(path: string): Lang {
  return /^\/en(?:\/|$)/.test(path) ? 'en' : defaultLang
}

/** Снимает префикс локали, чтобы `/en/blog` и `/blog` сравнивались как равные. */
export function stripLang(path: string): string {
  return path.replace(/^\/en(?=\/|$)/, '') || '/'
}

/** Та же страница на другом языке. На входе и выходе пути без base. */
export function swapLang(path: string, lang: Lang): string {
  const bare = stripLang(path)
  return lang === 'en' ? `/en${bare === '/' ? '' : bare}` : bare
}

export const otherLang = (lang: Lang): Lang => (lang === 'ru' ? 'en' : 'ru')
