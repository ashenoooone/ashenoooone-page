import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { TOPIC_KEYS } from './config/topics'
import { ACCENTS } from './lib/accents'

const accent = z.enum(ACCENTS)

/**
 * Каждая коллекция разложена как `<collection>/<lang>/<slug>.md`, поэтому id
 * записи читается как `ru/ssr-we-did-not-deserve`. У переводов общий slug — это
 * единственное, что их связывает, и на это опирается переключатель языка.
 */
const files = (base: string) => glob({ base, pattern: '**/*.md' })

const notes = defineCollection({
  loader: files('./src/content/notes'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    topic: z.enum(TOPIC_KEYS),
    draft: z.boolean().default(false),
  }),
})

const projects = defineCollection({
  loader: files('./src/content/projects'),
  schema: z.object({
    title: z.string(),
    /** Описание строки на странице проектов и meta-description самой страницы. */
    summary: z.string(),
    /** Короткое описание строки для главной; если нет — берётся `summary`. */
    teaser: z.string().optional(),
    /** Вводная строка 19px на странице проекта. */
    lead: z.string().optional(),
    kind: z.enum(['product', 'library']),
    /** Правая колонка строки: годы, «поддерживаю», «GitHub →». */
    aside: z.string(),
    period: z.string().optional(),
    role: z.array(z.object({ text: z.string(), accent: accent.default('blue') })).default([]),
    team: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    /** Моношрифтовые чипы под заголовком строки на странице проектов. */
    highlights: z.array(z.object({ label: z.string(), accent: accent.default('gray') })).default([]),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    gallery: z
      .array(
        z.object({
          caption: z.string(),
          src: z.string().optional(),
          alt: z.string().optional(),
          ratio: z.enum(['16/9', '3/4', '4/3', '1/1']).default('16/9'),
        }),
      )
      .default([]),
    order: z.number().default(99),
    /** Строки, ведущие полностью наружу, — своей страницы у них нет. */
    externalUrl: z.string().optional(),
    draft: z.boolean().default(false),
  }),
})

const pages = defineCollection({
  loader: files('./src/content/pages'),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    /** Вводная строка 19px. Нет у страницы проектов — она открывается сразу списком. */
    lead: z.string().optional(),
    /** Строки «подпись/значение» под вводной. */
    meta: z
      .array(
        z.object({
          label: z.string(),
          /** Рендерит строку списком технологий: мелкие точки, текст тише. */
          tech: z.boolean().default(false),
          items: z.array(
            z.object({
              text: z.string(),
              accent: accent.optional(),
              href: z.string().optional(),
            }),
          ),
        }),
      )
      .default([]),
    /** Закрывающий абзац под контактным блоком. */
    outro: z.string().optional(),
  }),
})

export const collections = { notes, projects, pages }
