/**
 * Vygeneruje statické HTML pro každou adresu webu a k tomu sitemap.
 *
 * Bez tohohle kroku dostane vyhledávač ze serveru prázdný <div id="root">
 * a obsah webu pro něj neexistuje – text se totiž skládá až v prohlížeči.
 *
 * Každá stránka má vlastní titulek, popisek, kanonickou adresu a strukturovaná
 * data; společné je jen tělo šablony z dist/index.html, které nese odkazy na
 * sestavené CSS a JS.
 *
 * Klientský a SSR build běží každý zvlášť, takže si hashované názvy souborů
 * odvozují nezávisle. Kdyby se rozešly, odkazovalo by vygenerované HTML na
 * neexistující soubory a stránka by se načetla bez stylů – skript proto na
 * závěr každý místní odkaz ověří proti obsahu dist/ a při neshodě build shodí.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const dist = join(root, 'dist')
const SITE_URL = 'https://naturelift.help'
const MARKER = '<!--app-html-->'

const { render, allRoutes, buildJsonLd, NOT_FOUND_PATH } = await import('./dist-ssr/entry-server.js')

const template = readFileSync(join(dist, 'index.html'), 'utf-8')
if (!template.includes(MARKER)) {
  throw new Error(`V dist/index.html chybí značka ${MARKER}, není kam vložit obsah.`)
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Nahradí obsah atributu content u meta tagu daného jménem/vlastností. */
function setMeta(html, attr, name, value) {
  const pattern = new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`)
  return html.replace(pattern, `$1${escapeAttr(value)}$2`)
}

const referenced = new Set()
const written = []

for (const route of allRoutes()) {
  const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path}`

  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(route.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${escapeAttr(canonical)}$2`)

  html = setMeta(html, 'name', 'description', route.description)
  html = setMeta(html, 'property', 'og:title', route.title)
  html = setMeta(html, 'property', 'og:description', route.description)
  html = setMeta(html, 'property', 'og:url', canonical)
  html = setMeta(html, 'name', 'twitter:title', route.title)
  html = setMeta(html, 'name', 'twitter:description', route.description)

  // Strukturovaná data konkrétní stránky nahradí ta ze šablony.
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(buildJsonLd(route.path), null, 2)}\n  </script>`
  )

  html = html.replace(MARKER, render(route.path))

  for (const match of html.matchAll(/(?:src|href)="(\/[^"]+)"/g)) {
    const url = match[1].split('?')[0].split('#')[0]
    // Adresy stránek nemají příponu – ověřují se soubory, ne odkazy na stránky.
    if (/\.[a-z0-9]{2,5}$/i.test(url)) referenced.add(url)
  }

  const outDir = route.path === '/' ? dist : join(dist, route.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)

  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  written.push({ path: route.path, chars: text.length })
}

// Stranka pro neexistujici adresy; Netlify ji vraci se stavem 404.
{
  const html = template
    .replace(/<title>[^<]*<\/title>/, '<title>Stránka nenalezena | NatureLift</title>')
    .replace(MARKER, render(NOT_FOUND_PATH))
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      '<meta name="robots" content="noindex" />'
    )
  writeFileSync(join(dist, '404.html'), html)
}

const missing = [...referenced].filter((url) => !existsSync(join(dist, url)))
if (missing.length > 0) {
  throw new Error(
    'Vygenerované HTML odkazuje na soubory, které v dist/ nejsou:\n  ' +
      missing.join('\n  ') +
      '\nKlientský a SSR build si nejspíš vygenerovaly různé názvy.'
  )
}

// Sitemap ze stejného seznamu adres, ať na žádnou nezapomene.
const today = new Date().toISOString().split('T')[0]
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  allRoutes()
    .map(
      (route) =>
        `  <url>\n    <loc>${SITE_URL}${route.path === '/' ? '/' : route.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n` +
        `    <priority>${route.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('\n') +
  '\n</urlset>\n'
writeFileSync(join(dist, 'sitemap.xml'), sitemap)

const total = written.reduce((sum, page) => sum + page.chars, 0)
console.log(`prerender: ${written.length} stránek, ${total} znaků textu pro roboty, ${referenced.size} odkazů ověřeno`)
for (const page of written) {
  console.log(`  ${page.path.padEnd(28)} ${String(page.chars).padStart(6)} znaků`)
}
