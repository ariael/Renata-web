import { services, settings, servicePath, LOCATION_SLUGS } from './routes'
import type { Service, SiteLocation } from './fallbackData'

/**
 * Strukturovaná data pro jednotlivé stránky.
 *
 * Vyhledávač si díky nim spojí web se zápisem na Google Maps a rozumí tomu,
 * co se kde nabízí. Otevírací doba se tu záměrně neuvádí – salon žádnou
 * pevnou nemá a vyplnit ji jen kvůli úplnosti by znamenalo poslat lidi
 * na zavřené dveře.
 */

export const SITE_URL = 'https://naturelift.help'

/** „1 200 Kč" → „1200"; vrací null, pokud v textu žádné číslo není. */
function priceNumber(price: string): string | null {
  const digits = price.replace(/[^\d]/g, '')
  return digits ? digits : null
}

function postalAddress(location: SiteLocation) {
  return {
    '@type': 'PostalAddress',
    ...(location.street ? { streetAddress: location.street } : {}),
    ...(location.city ? { addressLocality: location.city } : {}),
    ...(location.region ? { addressRegion: location.region } : {}),
    addressCountry: 'CZ',
  }
}

function business() {
  const locations = settings.locations ?? []
  const prices = services.map((s) => priceNumber(s.price)).filter((p): p is string => p !== null).map(Number)

  return {
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'NatureLift',
    description: settings.seoDescription,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/favicon.svg`,
    url: `${SITE_URL}/`,
    ...(settings.contactPhone ? { telephone: settings.contactPhone.replace(/\s+/g, '') } : {}),
    ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
    ...(settings.contactName ? { founder: { '@type': 'Person', name: settings.contactName } } : {}),
    ...(prices.length > 0
      ? { priceRange: `${Math.min(...prices)} – ${Math.max(...prices)} Kč` }
      : {}),
    currenciesAccepted: 'CZK',
    knowsLanguage: 'cs',
    ...(locations.length > 0
      ? {
          address: postalAddress(locations[0]),
          areaServed: [...new Set(locations.map((l) => l.city.replace(/\s+\d+$/, '').trim()))].map(
            (name) => ({ '@type': 'City', name })
          ),
        }
      : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Ošetření NatureLift',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        ...(priceNumber(service.price) ? { price: priceNumber(service.price) } : {}),
        priceCurrency: 'CZK',
        url: `${SITE_URL}${servicePath(service)}`,
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          ...(service.shortDesc ? { description: service.shortDesc } : {}),
        },
      })),
    },
  }
}

function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Úvod', path: '/' }, ...trail].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

function serviceNode(service: Service) {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}${servicePath(service)}#service`,
    name: service.title,
    ...(service.shortDesc ? { description: service.shortDesc } : {}),
    url: `${SITE_URL}${servicePath(service)}`,
    serviceType: service.title,
    provider: { '@id': `${SITE_URL}/#business` },
    areaServed: (settings.locations ?? []).map((l) => ({
      '@type': 'City',
      name: l.city.replace(/\s+\d+$/, '').trim(),
    })),
    ...(priceNumber(service.price)
      ? {
          offers: {
            '@type': 'Offer',
            price: priceNumber(service.price),
            priceCurrency: 'CZK',
            url: `${SITE_URL}${servicePath(service)}`,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  }
}

function locationNode(location: SiteLocation, slug: string) {
  return {
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${SITE_URL}/${slug}#business`,
    name: location.name || `NatureLift ${location.city}`,
    parentOrganization: { '@id': `${SITE_URL}/#business` },
    url: `${SITE_URL}/${slug}`,
    image: `${SITE_URL}/og-image.jpg`,
    ...(settings.contactPhone ? { telephone: settings.contactPhone.replace(/\s+/g, '') } : {}),
    ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
    address: postalAddress(location),
    currenciesAccepted: 'CZK',
    // Pevná otevírací doba neexistuje, termíny jsou po domluvě.
    availableService: services.map((service) => ({
      '@type': 'Service',
      name: service.title,
      url: `${SITE_URL}${servicePath(service)}`,
    })),
  }
}

/** Vrátí JSON-LD graf pro danou adresu. */
export function buildJsonLd(path: string): object {
  const graph: object[] = [business()]

  const service = services.find((s) => servicePath(s) === path)
  if (service) {
    graph.push(serviceNode(service))
    graph.push(breadcrumbs([{ name: 'Služby', path: '/#sluzby' }, { name: service.title, path }]))
    return { '@context': 'https://schema.org', '@graph': graph }
  }

  const locationIndex = LOCATION_SLUGS.findIndex((slug) => `/${slug}` === path)
  const location = locationIndex >= 0 ? settings.locations?.[locationIndex] : undefined
  if (location) {
    graph.push(locationNode(location, LOCATION_SLUGS[locationIndex]))
    graph.push(breadcrumbs([{ name: 'Kontakt', path: '/kontakt' }, { name: location.city, path }]))
    return { '@context': 'https://schema.org', '@graph': graph }
  }

  const named: Record<string, string> = {
    '/cenik': 'Ceník',
    '/darkovy-poukaz': 'Dárkový poukaz',
    '/o-mne': 'O mně',
    '/kontakt': 'Kontakt',
  }
  if (named[path]) {
    graph.push(breadcrumbs([{ name: named[path], path }]))
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
