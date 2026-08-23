import type { Lang } from '../i18n/ui'
import { localeUrl, site, siteContent } from '../config/site'

/** Данные заметки, которых нет у обычной страницы. */
export interface ArticleMeta {
  published: Date
  updated?: Date
  /** Тема заметки — уходит в `keywords`. */
  keywords?: string
}

export interface Crumb {
  name: string
  url: string
}

interface Context {
  lang: Lang
  /** Origin сайта; от него считаются абсолютные ссылки разметки. */
  origin: URL
  canonical: URL
  image: URL
}

const abs = (path: string, lang: Lang, origin: URL) => new URL(localeUrl(path, lang), origin).href

/**
 * Один и тот же человек упоминается на нескольких страницах, поэтому у узла
 * стабильный `@id`: так поисковик видит автора заметки и героя главной как
 * одну сущность, а не как двух однофамильцев.
 */
export const personId = (lang: Lang, origin: URL) => `${abs('/', lang, origin)}#person`

export function personSchema({ lang, origin, image }: Omit<Context, 'canonical'>, description: string) {
  const content = siteContent[lang]

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(lang, origin),
    'name': content.title,
    'jobTitle': content.jobTitle,
    'description': description,
    'url': abs('/', lang, origin),
    'image': image.href,
    'email': `mailto:${site.email}`,
    'knowsLanguage': ['ru', 'en'],
    'sameAs': content.socials.map(social => social.href),
  }
}

export function articleSchema(
  { lang, origin, canonical, image }: Context,
  { title, description, article }: { title: string, description: string, article: ArticleMeta },
) {
  const content = siteContent[lang]

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'inLanguage': lang,
    'datePublished': article.published.toISOString(),
    'dateModified': (article.updated ?? article.published).toISOString(),
    'keywords': article.keywords,
    'image': image.href,
    'mainEntityOfPage': canonical.href,
    'author': { '@type': 'Person', '@id': personId(lang, origin), 'name': content.title },
    'publisher': { '@type': 'Person', '@id': personId(lang, origin), 'name': content.title },
  }
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.url,
    })),
  }
}
