import { services, settings, servicePath } from '../routes'
import { formatCzk, czDate } from '../format'

/** Blok se zavadeci cenou. Skryje se, kdyz je cena v CMS nastavena na 0. */
export function IntroOffer() {
  if (settings.introOfferPrice <= 0) return null

  return (
    <div className="intro-offer">
      <div className="intro-offer-figure">
        <span className="intro-offer-eyebrow">{settings.introOfferTitle}</span>
        <div className="intro-offer-amount">
          <span className="intro-offer-now">{formatCzk(settings.introOfferPrice)}</span>
          {settings.introOfferRegularPrice > settings.introOfferPrice && (
            <span className="intro-offer-was">
              <span className="sr-only">běžná cena </span>
              <s>{formatCzk(settings.introOfferRegularPrice)}</s>
            </span>
          )}
        </div>
      </div>

      <div className="intro-offer-body">
        <p className="intro-offer-lead">{settings.introOfferLead}</p>
        <ul className="intro-offer-conditions">
          {settings.introOfferConditions.map((condition, idx) => (
            <li key={idx}>
              <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{condition}</span>
            </li>
          ))}
        </ul>
        {(settings.introOfferUntil || settings.introOfferNote) && (
          <p className="intro-offer-note">
            {settings.introOfferUntil && <strong>Platí do {czDate(settings.introOfferUntil)}. </strong>}
            {settings.introOfferNote}
          </p>
        )}
      </div>
    </div>
  )
}

/** Tabulka cen jednotlivych osetreni. */
export function PriceTable() {
  return (
    <div className="pricing-table-container">
      {services.map((service) => (
        <div className="pricing-row" key={service.id}>
          <div className="pricing-info">
            <div className="pricing-title">
              <a href={servicePath(service)}>{service.title}</a>
            </div>
            <div className="pricing-desc">{service.tagline}</div>
          </div>
          <div className="pricing-meta">
            <div className="pricing-time">{service.duration}</div>
            <div className="pricing-price">{service.price}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
