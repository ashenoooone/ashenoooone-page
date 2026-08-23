import type { Lang } from '../i18n/ui'
import type { Accent } from '../lib/accents'

/**
 * Темы заметок. Ключ — сегмент URL (`/blog/topic/performance`), одинаковый
 * в обоих языках, поэтому у страницы темы перевод есть по построению.
 */
export const TOPICS = {
  performance: {
    accent: 'rust',
    label: { ru: 'производительность', en: 'performance' },
  },
  architecture: {
    accent: 'blue',
    label: { ru: 'архитектура', en: 'architecture' },
  },
  agents: {
    accent: 'green',
    label: { ru: 'AI-агенты', en: 'AI agents' },
  },
  process: {
    accent: 'gold',
    label: { ru: 'процессы', en: 'process' },
  },
} as const satisfies Record<string, { accent: Accent, label: Record<Lang, string> }>

export type Topic = keyof typeof TOPICS

export const TOPIC_KEYS = Object.keys(TOPICS) as [Topic, ...Topic[]]

export function topicLabel(topic: Topic, lang: Lang): string {
  return TOPICS[topic].label[lang]
}

export function topicAccent(topic: Topic): Accent {
  return TOPICS[topic].accent
}
