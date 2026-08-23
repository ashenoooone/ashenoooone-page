import type { APIContext } from 'astro'
import type { Lang } from '../i18n/ui'
import { localeUrl } from '../config/site'
import { TOPIC_KEYS } from '../config/topics'
import { defaultLang, LANGS } from '../i18n/ui'
import { getNotes, getProjectPages, slugOf } from '../lib/content'

interface Entry {
  path: string
  /** Дата последней правки; есть только там, где её знает контент. */
  lastmod?: Date
}

/** Пути без локали, которые публикует заданный язык. */
async function pathsOf(lang: Lang): Promise<Entry[]> {
  const [notes, projects] = await Promise.all([getNotes(lang), getProjectPages(lang)])

  /** Свежесть раздела — дата самой новой заметки в нём. */
  const newest = (list: typeof notes) =>
    list.reduce<Date | undefined>((max, note) => (!max || note.data.date > max ? note.data.date : max), undefined)

  return [
    { path: '/', lastmod: newest(notes) },
    { path: '/blog', lastmod: newest(notes) },
    { path: '/projects' },
    ...TOPIC_KEYS.map(topic => ({
      path: `/blog/topic/${topic}`,
      lastmod: newest(notes.filter(note => note.data.topic === topic)),
    })),
    ...notes.map(note => ({ path: `/blog/${slugOf(note)}`, lastmod: note.data.date })),
    ...projects.map(project => ({ path: `/projects/${slugOf(project)}` })),
  ]
}

export async function GET({ site, url }: APIContext): Promise<Response> {
  const origin = site ?? new URL(url.origin)
  const href = (path: string, lang: Lang) => new URL(localeUrl(path, lang), origin).href

  /** Путь без локали → языки, которые его публикуют; заметка может быть только на одном. */
  const langsOf = new Map<string, Lang[]>()
  const lastmodOf = new Map<string, Date>()

  for (const lang of LANGS) {
    for (const { path, lastmod } of await pathsOf(lang)) {
      langsOf.set(path, [...(langsOf.get(path) ?? []), lang])

      const known = lastmodOf.get(path)
      if (lastmod && (!known || lastmod > known))
        lastmodOf.set(path, lastmod)
    }
  }

  const entries = [...langsOf].flatMap(([path, langs]) => {
    // Кластер из одного ничего не сообщает, поэтому непереведённые страницы
    // остаются голыми — то же правило, что `translated={false}` в лейауте.
    const alternates = langs.length > 1
      ? [...langs, 'x-default' as const].map((code) => {
          const target = code === 'x-default' ? (langs.includes(defaultLang) ? defaultLang : langs[0]!) : code
          return `    <xhtml:link rel="alternate" hreflang="${code}" href="${href(path, target)}"/>`
        })
      : []

    const lastmod = lastmodOf.get(path)

    return langs.map(lang => [
      '  <url>',
      `    <loc>${href(path, lang)}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>`] : []),
      ...alternates,
      '  </url>',
    ].join('\n'))
  })

  const body = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
