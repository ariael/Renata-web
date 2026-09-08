import { useState } from 'react'
import type { Service } from '../fallbackData'
import { services, servicePath, settings } from '../routes'
import PageShell from '../components/PageShell'
import BookingForm from '../components/BookingForm'

/** Samostatná stránka jednoho ošetření – detail, který dřív byl jen v modálním okně. */
export default function ServicePage({ service }: { service: Service }) {
  const [bookedService, setBookedService] = useState(service.id)
  const others = services.filter((s) => s.id !== service.id)

  return (
    <PageShell
      title={service.title}
      lead={service.tagline}
      crumbs={[{ label: 'Služby', href: '/#sluzby' }, { label: service.title }]}
    >
      <section className="section">
        <div className="container subpage-grid">
          <div className="subpage-main">
            <img
              className="subpage-image"
              src={service.image}
              alt={`${service.title} – ${service.tagline}`}
              width={800}
              height={520}
            />

            <p className="subpage-perex">{service.shortDesc}</p>
            <p>{service.longDesc}</p>

            {service.benefits.length > 0 && (
              <>
                <h2>Co vám ošetření přinese</h2>
                <ul className="subpage-benefits">
                  {service.benefits.map((benefit) => (
                    <li key={benefit}>
                      <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {service.contraindications && (
              <div className="subpage-warning">
                <h2>Kdy ošetření není vhodné</h2>
                <p>{service.contraindications}</p>
                <p className="subpage-warning-note">
                  Nejste si jistá? Napište mi před rezervací na{' '}
                  <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> a probereme to.
                </p>
              </div>
            )}
          </div>

          <aside className="subpage-aside">
            <div className="subpage-card">
              <div className="subpage-card-row">
                <span>Délka ošetření</span>
                <strong>{service.duration}</strong>
              </div>
              <div className="subpage-card-row">
                <span>Cena</span>
                <strong>{service.price}</strong>
              </div>
              <div className="subpage-card-row">
                <span>Kde</span>
                <strong>{settings.contactAddress}</strong>
              </div>
              <p className="subpage-card-note">{settings.contactAvailability}</p>
              <a href="#rezervace" className="btn btn-primary" style={{ width: '100%' }}>
                Rezervovat termín
              </a>
              <a href="/cenik" className="subpage-card-link">Zobrazit celý ceník</a>
            </div>

            <div className="subpage-card subpage-card-quiet">
              <h2 className="subpage-card-title">Další ošetření</h2>
              <ul className="subpage-card-list">
                {others.map((other) => (
                  <li key={other.id}>
                    <a href={servicePath(other)}>
                      <strong>{other.title}</strong>
                      <span>{other.duration} · {other.price}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section-bg">
        <div className="container subpage-booking">
          <BookingForm service={bookedService} onServiceChange={setBookedService} />
        </div>
      </section>
    </PageShell>
  )
}
