import { getServices, getHomepageSettings } from './cmsClient'
import type { Service } from './fallbackData'

/**
 * Obsah z CMS a seznam adres webu.
 *
 * Data se pečou do bundlu při buildu, za běhu se nemění – proto konstanty.
 * Stejný modul čte předrenderování (viz prerender.mjs), takže robot i
 * návštěvník dostanou tentýž obsah.
 */
export const services = getServices()
export const settings = getHomepageSettings()

/**
 * Adresy stránek služeb.
 *
 * Klíčem je `id` z CMS, ne název – kdyby se totiž slug odvozoval z názvu,
 * změna titulku v administraci by rozbila zaindexovanou adresu. Služba, která
 * tu chybí, dostane adresu podle svého id.
 */
const SERVICE_SLUGS: Record<string, string> = {
  buccal: 'bukalni-masaz',
  guasha: 'gua-sha',
  cupping: 'bankovani-obliceje',
  auriculo: 'aurikuloterapie',
}

export function servicePath(service: Service): string {
  return `/sluzby/${SERVICE_SLUGS[service.id] ?? service.id}`
}

export function serviceByPath(path: string): Service | undefined {
  return services.find((s) => servicePath(s) === path)
}

/** Provozovny s vlastní stránkou; pořadí odpovídá settings.locations. */
export const LOCATION_SLUGS = ['praha', 'podebrady'] as const

export function locationByPath(path: string) {
  const index = LOCATION_SLUGS.findIndex((slug) => `/${slug}` === path)
  if (index === -1) return undefined
  const location = settings.locations?.[index]
  return location ? { ...location, slug: LOCATION_SLUGS[index] } : undefined
}

export interface RouteMeta {
  path: string
  title: string
  description: string
  /** Priorita v sitemap.xml. */
  priority: number
}

/** Zkrátí text na délku vhodnou pro meta description. */
function clip(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).replace(/[\s,;.–-]+$/, '')}…`
}

export function allRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = [
    {
      path: '/',
      title: settings.seoTitle,
      description: settings.seoDescription,
      priority: 1.0,
    },
  ]

  for (const service of services) {
    routes.push({
      path: servicePath(service),
      title: `${service.title} – Praha a Poděbrady | NatureLift`,
      description: clip(service.shortDesc || service.tagline),
      priority: 0.9,
    })
  }

  routes.push({
    path: '/cenik',
    title: 'Ceník ošetření – Praha a Poděbrady | NatureLift',
    description: clip(settings.pricingDesc),
    priority: 0.8,
  })

  routes.push({
    path: '/darkovy-poukaz',
    title: 'Dárkový poukaz na masáž obličeje | NatureLift',
    description: clip(settings.vouchersIntro),
    priority: 0.9,
  })

  routes.push({
    path: '/o-mne',
    title: `${settings.contactName} – ${settings.aboutTitle} | NatureLift`,
    description: clip(settings.aboutText1),
    priority: 0.6,
  })

  routes.push({
    path: '/kontakt',
    title: 'Kontakt a objednání | NatureLift',
    description: clip(
      `${settings.contactDesc} ${settings.contactAvailability}`
    ),
    priority: 0.7,
  })

  const locations = settings.locations ?? []
  LOCATION_SLUGS.forEach((slug, index) => {
    const location = locations[index]
    if (!location) return
    routes.push({
      path: `/${slug}`,
      title: `Masáž obličeje ${location.city} – ${location.street} | NatureLift`,
      description: clip(
        `Bukální masáž, Gua Sha, baňkování obličeje a aurikuloterapie na adrese ` +
          `${location.street}, ${location.city}. ${settings.contactAvailability}`
      ),
      priority: 0.8,
    })
  })

  return routes
}
