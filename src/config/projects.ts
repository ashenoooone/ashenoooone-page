import type { Lang } from '../i18n/ui'
import type { Accent } from '../lib/accents'

export interface ProjectItem {
  title: string
  href: string
  description: Record<Lang, string>
  /** Правая колонка строки: роль, годы, «GitHub →». */
  aside: Record<Lang, string>
}

export interface ProjectGroup {
  label: Record<Lang, string>
  accent: Accent
  items: ProjectItem[]
}

/** Список как у antfu: группы открытых проектов, каждая строка ведёт наружу. */
export const PROJECTS: ProjectGroup[] = []
