/**
 * Рисует превью для соцсетей: `public/og.png` и `public/og-en.png`, 1200×630.
 * Запускается руками после смены имени, тайтла или палитры:
 *
 *     node scripts/og.mjs
 *
 * Шрифт один — JetBrains Mono из `src/assets`: он и так лежит в репозитории,
 * а картинка через fontconfig видит только файлы с диска, не CSS сайта.
 * `sharp` приезжает вместе с astro, отдельной зависимости у скрипта нет.
 */
import { mkdir, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import process from 'node:process'

const ASSETS = resolve('src/assets')

/** fontconfig читает `$XDG_DATA_HOME/fonts`, поэтому шрифты подкладываются туда. */
async function useLocalFonts() {
  const home = join(tmpdir(), 'og-fonts')
  const dir = join(home, 'fonts')
  await mkdir(dir, { recursive: true })

  for (const face of ['Regular', 'Medium', 'SemiBold']) {
    const file = `JetBrainsMono-${face}.ttf`
    await symlink(join(ASSETS, file), join(dir, file)).catch(() => {})
  }

  process.env.XDG_DATA_HOME = home
}

const C = {
  bg: '#101112',
  line: '#232628',
  display: '#f5f6f7',
  soft: '#a9aeb0',
  faint: '#6d7173',
  gold: '#d3a44f',
}

const CARDS = [
  {
    file: 'og.png',
    name: 'Роман Гонтарь',
    role: 'frontend-разработчик',
    lines: ['Интерфейсы, которым нельзя тормозить.', 'Заметки о производительности и архитектуре.'],
  },
  {
    file: 'og-en.png',
    name: 'Roman Gontar',
    role: 'frontend developer',
    lines: ['Interfaces that are not allowed to be slow.', 'Notes on performance and architecture.'],
  },
]

const escape = text => text.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch])

function card({ name, role, lines }) {
  const x = 96

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="${C.line}" stroke-width="1"/>

  <text x="${x}" y="138" font-family="JetBrains Mono" font-size="26" fill="${C.faint}">
    <tspan>{</tspan><tspan fill="${C.display}">rg</tspan><tspan>}</tspan>
  </text>

  <text x="${x}" y="300" font-family="JetBrains Mono" font-size="72" font-weight="600" letter-spacing="-2" fill="${C.display}">${escape(name)}</text>

  <circle cx="${x + 7}" cy="352" r="7" fill="${C.gold}"/>
  <text x="${x + 30}" y="359" font-family="JetBrains Mono" font-size="27" fill="${C.soft}">${escape(role)}</text>

  ${lines
    .map((line, i) => `<text x="${x}" y="${446 + i * 42}" font-family="JetBrains Mono" font-size="25" fill="${C.faint}">${escape(line)}</text>`)
    .join('\n  ')}

  <text x="${x}" y="546" font-family="JetBrains Mono" font-size="22" fill="${C.faint}">ashenoooone.github.io/ashenoooone-page</text>
</svg>`
}

await useLocalFonts()
const { default: sharp } = await import('sharp')

for (const spec of CARDS) {
  const svg = card(spec)
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(join('public', spec.file))
  console.log(`public/${spec.file}`)
}
