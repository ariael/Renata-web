import { useState } from 'react'
import type { SiteLocation } from '../fallbackData'
import { services, settings, servicePath } from '../routes'
import PageShell from '../components/PageShell'
import BookingForm from '../components/BookingForm'
import VoucherPackages from '../components/VoucherPackages'
import { IntroOffer, PriceTable } from '../components/PriceList'

/** Ceník – zaváděcí nabídka, tabulka cen a odkaz na poukazy. */
export function PricingPage() {
  const [bookedService, setBookedService] = useState('')

  return (
    <PageShell title={settings.pricingTitle} lead={settings.pricingDesc} crumbs={[{ label: 'Ceník' }]}>
      <section className="section">
        <div className="container">
          <IntroOffer />
          <PriceTable />
          <p className="subpage-note">{settings.contactAvailability}</p>
        </div>
      </section>

      <section className="section section-bg">
        <div className="container">
          <VoucherPackages onOrder={setBookedService} />
        </div>
      </section>

      <section className="section">
        <div className="container subpage-booking">
          <BookingForm service={bookedService} onServiceChange={setBookedService} />
        </div>
      </section>
    </PageShell>
  )
}

/** Dárkový poukaz – samostatná stránka, na kterou má smysl posílat reklamu. */
export function VoucherPage() {
  const [bookedService, setBookedService] = useState('')

  return (
    <PageShell
      title={settings.vouchersTitle}
      lead={settings.vouchersIntro}
      crumbs={[{ label: 'Dárkový poukaz' }]}
    >
      <section className="section">
        <div className="container">
          <VoucherPackages onOrder={setBookedService} showHeading={false} />
        </div>
      </section>

      <section className="section section-bg">
        <div className="container">
          <h2 className="subpage-section-title">Jak to probíhá</h2>
          <ol className="subpage-steps">
            <li>
              <strong>Objednáte poukaz</strong>
              <span>Vyplníte formulář níž – stačí jméno obdarované a vaše spojení.</span>
            </li>
            <li>
              <strong>Domluvíme podrobnosti</strong>
              <span>Ozvu se vám a doladíme znění poukazu i způsob předání.</span>
            </li>
            <li>
              <strong>Poukaz vystavím</strong>
              <span>Dostanete ho tištěný, nebo v PDF k vytištění – podle toho, co se vám hodí víc.</span>
            </li>
            <li>
              <strong>Obdarovaná si domluví termín</strong>
              <span>Ozve se mi s kódem z poukazu, kdy jí to vyhovuje.</span>
            </li>
          </ol>
          {settings.vouchersNote && <p className="subpage-note">{settings.vouchersNote}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container subpage-booking">
          <BookingForm service={bookedService} onServiceChange={setBookedService} />
        </div>
      </section>
    </PageShell>
  )
}

/** O mně. */
export function AboutPage() {
  return (
    <PageShell title={settings.aboutTitle} lead={settings.aboutText1} crumbs={[{ label: 'O mně' }]}>
      <section className="section">
        <div className="container subpage-prose">
          <p>{settings.aboutText2}</p>
          {settings.aboutQuote && <blockquote className="subpage-quote">{settings.aboutQuote}</blockquote>}
          <p>{settings.aboutText3}</p>

          <h2>Co nabízím</h2>
          <ul className="subpage-links">
            {services.map((service) => (
              <li key={service.id}>
                <a href={servicePath(service)}>
                  <strong>{service.title}</strong>
                  <span>{service.tagline}</span>
                </a>
              </li>
            ))}
          </ul>

          <p>
            <a href="/kontakt" className="btn btn-primary">Domluvit termín</a>
          </p>
        </div>
      </section>
    </PageShell>
  )
}

/** Kontakt včetně rezervačního formuláře a mapy. */
export function ContactPage() {
  const [bookedService, setBookedService] = useState('')
  const locations = settings.locations ?? []

  return (
    <PageShell title="Kontakt a objednání" lead={settings.contactDesc} crumbs={[{ label: 'Kontakt' }]}>
      <section className="section">
        <div className="container subpage-contact">
          <div className="subpage-card">
            <h2 className="subpage-card-title">Spojení</h2>
            <ul className="subpage-card-list">
              <li><a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}><strong>{settings.contactPhone}</strong><span>Telefon</span></a></li>
              <li><a href={`mailto:${settings.contactEmail}`}><strong>{settings.contactEmail}</strong><span>E-mail</span></a></li>
            </ul>
            <p className="subpage-card-note">{settings.contactAvailability}</p>
          </div>

          <div className="subpage-card subpage-card-quiet">
            <h2 className="subpage-card-title">Kde mě najdete</h2>
            <ul className="subpage-card-list">
              {locations.map((location, index) => (
                <li key={location.city}>
                  <a href={index === 0 ? '/praha' : '/podebrady'}>
                    <strong>{location.city}</strong>
                    <span>{location.street}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container subpage-booking">
          <BookingForm service={bookedService} onServiceChange={setBookedService} />
        </div>

        <div className="container">
          <div className="map-container">
            <iframe
              title="Mapa provozovny"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.mapAddress)}&output=embed&hl=cs&z=15`}
              referrerPolicy="no-referrer-when-downgrade"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </PageShell>
  )
}

/** Stránka provozovny – kvůli místnímu vyhledávání („masáž obličeje Praha 2"). */
export function LocationPage({ location }: { location: SiteLocation }) {
  const [bookedService, setBookedService] = useState('')
  const address = `${location.street}, ${location.city}`

  return (
    <PageShell
      title={`Masáž obličeje ${location.city}`}
      lead={`Bukální masáž, Gua Sha, baňkování obličeje a aurikuloterapie na adrese ${address}.`}
      crumbs={[{ label: 'Kontakt', href: '/kontakt' }, { label: location.city }]}
    >
      <section className="section">
        <div className="container subpage-contact">
          <div className="subpage-card">
            <h2 className="subpage-card-title">{location.name}</h2>
            <ul className="subpage-card-list">
              <li><span className="subpage-card-plain"><strong>{location.street}</strong><span>{location.city}</span></span></li>
              <li><a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}><strong>{settings.contactPhone}</strong><span>Telefon</span></a></li>
              <li><a href={`mailto:${settings.contactEmail}`}><strong>{settings.contactEmail}</strong><span>E-mail</span></a></li>
            </ul>
            <p className="subpage-card-note">{settings.contactAvailability}</p>
          </div>

          <div className="subpage-card subpage-card-quiet">
            <h2 className="subpage-card-title">Ošetření na této adrese</h2>
            <ul className="subpage-card-list">
              {services.map((service) => (
                <li key={service.id}>
                  <a href={servicePath(service)}>
                    <strong>{service.title}</strong>
                    <span>{service.duration} · {service.price}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container">
          <div className="map-container">
            <iframe
              title={`Mapa – ${location.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address}, Czech Republic`)}&output=embed&hl=cs&z=15`}
              referrerPolicy="no-referrer-when-downgrade"
              loading="lazy"
            />
          </div>
        </div>

        <div className="container subpage-booking">
          <BookingForm service={bookedService} onServiceChange={setBookedService} />
        </div>
      </section>
    </PageShell>
  )
}
