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

const pages = defineCollection({
  loader: files('./src/content/pages'),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    /** Вводная строка 19px. */
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

export const collections = { notes, pages }
