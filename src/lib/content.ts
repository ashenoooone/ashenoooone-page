import type { CollectionEntry } from 'astro:content'
import type { Lang } from '../i18n/ui'
import { getCollection, getEntry } from 'astro:content'

export type Note = CollectionEntry<'notes'>
export type Project = CollectionEntry<'projects'>
export type Page = CollectionEntry<'pages'>

/** `ru/ssr-we-did-not-deserve` → `ssr-we-did-not-deserve`. */
export function slugOf(entry: { id: string }): string {
  return entry.id.split('/').slice(1).join('/')
}

/** Черновики видны при написании и пропадают из собранного сайта. */
const published = (draft: boolean) => import.meta.env.DEV || !draft

const inLang = (id: string, lang: Lang) => id.startsWith(`${lang}/`)

export async function getNotes(lang: Lang): Promise<Note[]> {
  const notes = await getCollection(
    'notes',
    ({ id, data }) => inLang(id, lang) && published(data.draft),
  )

  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export async function getProjects(lang: Lang): Promise<Project[]> {
  const projects = await getCollection(
    'projects',
    ({ id, data }) => inLang(id, lang) && published(data.draft),
  )

  return projects.sort((a, b) => a.data.order - b.data.order)
}

/** Проекты со своей страницей — остальные только ссылаются наружу. */
export async function getProjectPages(lang: Lang): Promise<Project[]> {
  return (await getProjects(lang)).filter(project => !project.data.externalUrl)
}

export function getPage(name: 'home' | 'blog' | 'projects', lang: Lang) {
  return getEntry('pages', `${lang}/${name}`)
}

export function byYear(notes: Note[]): { year: number, notes: Note[] }[] {
  const groups = new Map<number, Note[]>()

  for (const note of notes) {
    const year = note.data.date.getUTCFullYear()
    groups.set(year, [...(groups.get(year) ?? []), note])
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, notes: items }))
}
