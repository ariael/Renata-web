import App from './App'
import ServicePage from './pages/ServicePage'
import { PricingPage, VoucherPage, AboutPage, ContactPage, LocationPage } from './pages/SimplePages'
import NotFoundPage from './pages/NotFoundPage'
import { serviceByPath, locationByPath } from './routes'

/** Adresa, pod kterou se generuje stránka pro neexistující cesty (dist/404.html). */
export const NOT_FOUND_PATH = '/404'

/** Odstraní koncové lomítko, ať `/cenik` a `/cenik/` skončí na téže stránce. */
function normalize(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

/**
 * Vybere stránku podle adresy.
 *
 * Web nepoužívá router – každá adresa je samostatný předrenderovaný soubor
 * a odkazy mezi nimi jsou obyčejné `<a href>`. Pro pár statických stránek je
 * to jednodušší i odolnější než klientské směrování a hlavně to znamená, že
 * každá adresa má vlastní HTML, které vyhledávač přečte bez JavaScriptu.
 */
export default function Root({ path }: { path: string }) {
  const pathname = normalize(path)

  const service = serviceByPath(pathname)
  if (service) return <ServicePage service={service} />

  const location = locationByPath(pathname)
  if (location) return <LocationPage location={location} />

  switch (pathname) {
    case '/cenik':
      return <PricingPage />
    case '/darkovy-poukaz':
      return <VoucherPage />
    case '/o-mne':
      return <AboutPage />
    case '/kontakt':
      return <ContactPage />
    case NOT_FOUND_PATH:
      return <NotFoundPage />
    default:
      return <App />
  }
}
