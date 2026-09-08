import { useSyncExternalStore } from 'react'
import { LogoStacked } from '../Logo'
import { settings, services, servicePath, LOCATION_SLUGS } from '../routes'

/**
 * Rok v patičce. Při předrenderování vyjde rok buildu, po hydrataci se srovná
 * na skutečný – kdyby se počítal jen za běhu, rozešlo by se HTML ze serveru
 * s tím, co vykreslí prohlížeč.
 */
const noSubscribe = () => () => {}
const clientYear = () => new Date().getFullYear()
const serverYear = () => __BUILD_YEAR__

export default function Footer() {
  const year = useSyncExternalStore(noSubscribe, clientYear, serverYear)
  const locations = settings.locations ?? []

  return (
    <footer>
      <div className="container">
        <LogoStacked subtitle={settings.contactName} />

        <ul className="footer-nav">
          <li><a href="/#omne">O mně</a></li>
          <li><a href="/#sluzby">Služby</a></li>
          <li><a href="/#proc">Proč přirozeně</a></li>
          <li><a href="/cenik">Ceník</a></li>
          <li><a href="/darkovy-poukaz">Dárkový poukaz</a></li>
          <li><a href="/kontakt">Kontakt</a></li>
        </ul>

        {/* Rozcestník na samostatné stránky – hlavní menu je na ně krátké. */}
        <nav className="footer-sitemap" aria-label="Další stránky">
          <div className="footer-sitemap-col">
            <h2 className="footer-sitemap-title">Ošetření</h2>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <a href={servicePath(service)}>{service.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {locations.length > 0 && (
            <div className="footer-sitemap-col">
              <h2 className="footer-sitemap-title">Kde mě najdete</h2>
              <ul>
                {locations.map((location, index) =>
                  LOCATION_SLUGS[index] ? (
                    <li key={location.city}>
                      <a href={`/${LOCATION_SLUGS[index]}`}>
                        {location.city} – {location.street}
                      </a>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          )}

          <div className="footer-sitemap-col">
            <h2 className="footer-sitemap-title">Kontakt</h2>
            <ul>
              <li><a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}>{settings.contactPhone}</a></li>
              <li><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li>
              <li><a href="/#rezervace">Rezervovat termín</a></li>
            </ul>
          </div>
        </nav>

        <div className="footer-copy">
          &copy; {year} NatureLift.help. Všechna práva vyhrazena.
          <br />
          <span style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.5rem', display: 'block' }}>
            {settings.footerNote}
          </span>
        </div>
      </div>
    </footer>
  )
}
