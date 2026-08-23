import tailwindcss from '@tailwindcss/vite'

// @ts-check
import { defineConfig } from 'astro/config'

const BASE = '/ashenoooone-page/'

/**
 * Markdown пишется с корневыми ссылками (`/notes`, `/en/projects`).
 * На Pages сайт живёт под base-путём, поэтому каждый внутренний href и src
 * получает префикс здесь — одно место вместо каждого файла контента.
 */
function rehypeBasePath() {
  const prefix = BASE.replace(/\/$/, '')

  const walk = (node) => {
    if (node.type === 'element') {
      for (const attr of ['href', 'src']) {
        const value = node.properties?.[attr]
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith(prefix)) {
          const isFile = value.split('/').pop().includes('.')
          const slash = isFile || value.endsWith('/') ? '' : '/'
          node.properties[attr] = `${prefix}${value}${slash}`
        }
      }
    }
    for (const child of node.children ?? []) {
      walk(child)
    }
  }

  return walk
}

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://ashenoooone.github.io',
  base: BASE,
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    rehypePlugins: [rehypeBasePath],
  },
})
