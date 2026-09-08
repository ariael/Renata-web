/**
 * Vloží do dist/index.html aplikaci vykreslenou při buildu.
 *
 * Bez tohohle kroku dostane vyhledávač ze serveru prázdný <div id="root">
 * a obsah webu pro něj neexistuje – text se totiž skládá až v prohlížeči.
 *
 * Klientský a SSR build běží každý zvlášť, takže si hashované názvy obrázků
 * odvozují nezávisle. Kdyby se rozešly, odkazovalo by předrenderované HTML na
 * neexistující soubory a stránka by se načetla bez fotek. Skript proto na
 * závěr každý místní odkaz ověří proti obsahu dist/ a při neshodě build shodí.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const distIndex = join(root, 'dist', 'index.html')

const { render } = await import('./dist-ssr/entry-server.js')

const template = readFileSync(distIndex, 'utf-8')
const MARKER = '<!--app-html-->'

if (!template.includes(MARKER)) {
  throw new Error(`V dist/index.html chybí značka ${MARKER}, není kam vložit obsah.`)
}

const appHtml = render()
const html = template.replace(MARKER, appHtml)

// Ověření odkazů na místní soubory (obrázky, styly, skripty).
const referenced = new Set()
for (const match of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) {
  const url = match[1].split('?')[0].split('#')[0]
  // Adresy stránek nemají příponu – ty se neověřují, ověřují se soubory.
  if (/\.[a-z0-9]{2,5}$/i.test(url)) referenced.add(url)
}

const missing = [...referenced].filter((url) => !existsSync(join(root, 'dist', url)))
if (missing.length > 0) {
  throw new Error(
    'Předrenderované HTML odkazuje na soubory, které v dist/ nejsou:\n  ' +
      missing.join('\n  ') +
      '\nKlientský a SSR build si nejspíš vygenerovaly různé názvy.'
  )
}

writeFileSync(distIndex, html)

// Kolik textu robot doopravdy uvidí – kvůli tomuhle číslu to celé je.
const bodyText = html
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

console.log(
  `prerender: vloženo ${appHtml.length} znaků HTML, ` +
    `robot uvidí ~${bodyText.length} znaků textu, ` +
    `${referenced.size} odkazů na soubory ověřeno`
)
