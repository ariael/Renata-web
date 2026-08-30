import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

/**
 * Sestaví titulek, meta popisky a JSON-LD přímo z dat, která spravuje Decap CMS.
 *
 * Dřív byly ceny a adresa v index.html natvrdo, takže po každé úpravě v
 * administraci zastaraly a vyhledávačům se hlásily jiné údaje, než jaké byly
 * na stránce. Tady se generují při buildu, takže se rozejít nemůžou.
 */

interface Location {
  name?: string
  street?: string
  city?: string
  region?: string
}

interface VoucherPackage {
  count: number
  title: string
  pricePerSession: number
}

const DATA_DIR = 'src/data'
const SITE_URL = 'https://naturelift.help'

function readJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

/** „1 200 Kč" → 1200; vrací null, pokud v textu žádné číslo není. */
function parsePrice(price: unknown): number | null {
  if (typeof price !== 'string') return null
  const digits = price.replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

function formatCzk(value: number): string {
  // cs-CZ odděluje tisíce nezlomitelnou mezerou; pro JSON-LD stačí obyčejná.
  const grouped = value.toLocaleString('cs-CZ').replace(/\s/g, ' ')
  return `${grouped} Kč`
}

/** Zkrátí dlouhý popis na první větu, aby se hodil do structured dat. */
function firstSentence(text: unknown, max = 200): string | undefined {
  if (typeof text !== 'string' || !text) return undefined
  const sentence = text.split(/(?<=\.)\s/)[0]
  return sentence.length > max ? `${sentence.slice(0, max - 1)}…` : sentence
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildSeo(root: string) {
  const settings = readJson(join(root, DATA_DIR, 'settings.json'))

  const servicesDir = join(root, DATA_DIR, 'services')
  const services = readdirSync(servicesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson(join(servicesDir, f)))
    .sort((a, b) => (Number(a.sortOrder) || 99) - (Number(b.sortOrder) || 99))

  const prices = services.map((s) => parsePrice(s.price)).filter((p): p is number => p !== null)
  const priceRange =
    prices.length > 0 ? `${formatCzk(Math.min(...prices))} – ${formatCzk(Math.max(...prices))}` : undefined

  const rawLocations = Array.isArray(settings.locations) ? (settings.locations as Location[]) : []
  const locations = rawLocations.filter((l) => l && (l.street || l.city))

  const rawPackages = Array.isArray(settings.voucherPackages) ? (settings.voucherPackages as VoucherPackage[]) : []
  const voucherPackages = rawPackages.filter(
    (p) => p && Number(p.count) >= 1 && Number(p.pricePerSession) > 0 && p.title
  )

  const toPostalAddress = (l: Location) => ({
    '@type': 'PostalAddress',
    ...(l.street ? { streetAddress: l.street } : {}),
    ...(l.city ? { addressLocality: l.city } : {}),
    ...(l.region ? { addressRegion: l.region } : {}),
    addressCountry: 'CZ'
  })

  const title = String(settings.seoTitle || 'NatureLift')
  const description = String(settings.seoDescription || '')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'NatureLift',
    description,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/favicon.svg`,
    url: `${SITE_URL}/`,
    ...(settings.contactPhone ? { telephone: String(settings.contactPhone).replace(/\s+/g, '') } : {}),
    ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
    ...(settings.contactName ? { founder: { '@type': 'Person', name: settings.contactName } } : {}),
    ...(priceRange ? { priceRange } : {}),
    currenciesAccepted: 'CZK',
    ...(locations.length > 0
      ? {
          address: toPostalAddress(locations[0]),
          ...(locations.length > 1
            ? {
                location: locations.map((l) => ({
                  '@type': 'Place',
                  ...(l.name ? { name: l.name } : {}),
                  address: toPostalAddress(l)
                }))
              }
            : {}),
          // Obsluhovaná oblast je celé město, ne konkrétní obvod („Praha 2" → „Praha").
          areaServed: [
            ...new Set(
              locations
                .map((l) => l.city?.replace(/\s+\d+$/, '').trim())
                .filter((c): c is string => Boolean(c))
            )
          ].map((name) => ({ '@type': 'City', name }))
        }
      : {}),
    knowsLanguage: 'cs',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Ošetření NatureLift',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        ...(parsePrice(s.price) !== null ? { price: String(parsePrice(s.price)) } : {}),
        priceCurrency: 'CZK',
        itemOffered: {
          '@type': 'Service',
          name: String(s.title ?? ''),
          ...(firstSentence(s.shortDesc) ? { description: firstSentence(s.shortDesc) } : {})
        }
      }))
    },
    ...(voucherPackages.length > 0
      ? {
          makesOffer: voucherPackages.map((p) => ({
            '@type': 'Offer',
            name: `Dárkový poukaz – ${p.title}`,
            price: String(p.count * p.pricePerSession),
            priceCurrency: 'CZK',
            category: 'Dárkový poukaz',
            itemOffered: {
              '@type': 'Service',
              name: `Dárkový poukaz na ${p.count}× masáž obličeje`,
              ...(settings.vouchersScope ? { description: String(settings.vouchersScope) } : {})
            }
          }))
        }
      : {})
  }

  return { title, description, jsonLd, voucherPackages }
}

export function seoFromCms(): Plugin {
  return {
    name: 'naturelift-seo-from-cms',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const root = ctx.server?.config.root ?? process.cwd()
        const { title, description, jsonLd, voucherPackages } = buildSeo(root)

        return html
          .replaceAll('%SEO_TITLE%', escapeAttr(title))
          .replaceAll('%SEO_DESCRIPTION%', escapeAttr(description))
          .replace('<!--%SEO_JSONLD%-->', `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>`)
          // Interní generátor poukazů si bere ceník odsud, ať se nerozejde s webem.
          .replaceAll('%VOUCHER_PACKAGES%', JSON.stringify(
            Object.fromEntries(
              voucherPackages.map((p) => [String(p.count), { count: Number(p.count), perSession: Number(p.pricePerSession) }])
            )
          ))
      }
    }
  }
}
