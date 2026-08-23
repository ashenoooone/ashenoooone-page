import type { Lang } from '../i18n/ui'
import { localeUrl, siteContent } from '../config/site'
import { useTranslations } from '../i18n/ui'
import { getNotes, slugOf } from './content'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * RSS 2.0 руками — в фиде десяток элементов простого текста, это заметно
 * дешевле, чем зависимость.
 */
export async function buildFeed(lang: Lang, origin: URL): Promise<string> {
  const t = useTranslations(lang)
  const notes = await getNotes(lang)

  const channelLink = new URL(localeUrl('/blog', lang), origin).href
  const selfLink = new URL(localeUrl('/rss.xml', lang), origin).href

  const items = notes
    .map((note) => {
      const link = new URL(localeUrl(`/blog/${slugOf(note)}`, lang), origin).href

      return [
        '    <item>',
        `      <title>${escapeXml(note.data.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${note.data.date.toUTCString()}</pubDate>`,
        `      <description>${escapeXml(note.data.description)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(t('rss.title'))}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(t('rss.description'))}</description>
    <language>${lang}</language>
    <copyright>${escapeXml(siteContent[lang].title)}</copyright>
    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}
