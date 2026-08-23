/**
 * Палитра акцентов. Каждый маркер, тег и рамка при наведении выбирают одно
 * из этих имён; сам цвет меняется вместе с темой.
 *
 * Строки классов выписаны целиком, чтобы Tailwind нашёл их при сканировании
 * исходников, — не собирайте их динамически.
 */

export const ACCENTS = [
  'gold',
  'green',
  'moss',
  'red',
  'rust',
  'orange',
  'blue',
  'indigo',
  'teal',
  'gray',
  'silver',
] as const

export type Accent = (typeof ACCENTS)[number]

export const accentBg: Record<Accent, string> = {
  gold: 'bg-dot-gold',
  green: 'bg-dot-green',
  moss: 'bg-dot-moss',
  red: 'bg-dot-red',
  rust: 'bg-dot-rust',
  orange: 'bg-dot-orange',
  blue: 'bg-dot-blue',
  indigo: 'bg-dot-indigo',
  teal: 'bg-dot-teal',
  gray: 'bg-dot-gray',
  silver: 'bg-dot-silver',
}

export const accentHoverBorder: Record<Accent, string> = {
  gold: 'hover:border-dot-gold',
  green: 'hover:border-dot-green',
  moss: 'hover:border-dot-moss',
  red: 'hover:border-dot-red',
  rust: 'hover:border-dot-rust',
  orange: 'hover:border-dot-orange',
  blue: 'hover:border-dot-blue',
  indigo: 'hover:border-dot-indigo',
  teal: 'hover:border-dot-teal',
  gray: 'hover:border-dot-gray',
  silver: 'hover:border-dot-silver',
}

/** Постоянный цвет технологии, чтобы стек выглядел одинаково везде. */
export const techAccent: Record<string, Accent> = {
  'typescript': 'indigo',
  'react': 'teal',
  'react 19': 'teal',
  'next.js': 'gray',
  'next.js 15': 'gray',
  'effector': 'orange',
  'tanstack query': 'rust',
  'node.js': 'moss',
  'redis': 'moss',
  'astro': 'red',
  'tailwind': 'teal',
  'tailwind 3.3': 'teal',
  'typescript 5.3': 'indigo',
  'react 18.2': 'teal',
  'next.js 13.5': 'gray',
  'redux toolkit': 'indigo',
  'redux toolkit 1.9': 'indigo',
}

export function accentForTech(name: string, fallback: Accent = 'gray'): Accent {
  return techAccent[name.trim().toLowerCase()] ?? fallback
}
