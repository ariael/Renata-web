import { useState, useEffect, useRef } from 'react'
import './App.css'
import type { Service } from './fallbackData'
import { services, settings } from './routes'
import { formatCzk, czDate, voucherServiceId } from './format'
import Header from './components/Header'
import Footer from './components/Footer'
import BookingForm from './components/BookingForm'


export default function App() {
  const [activeService, setActiveService] = useState<Service | null>(null)

  // Vybrana sluzba v rezervaci. Drzi ji stranka, protoze ji predvyplnuje
  // tlacitko u balicku poukazu i tlacitko v detailu osetreni.
  const [bookedService, setBookedService] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    )

    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => observer.observe(el))

    return () => {
      revealElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // Modální okno: zamknout scroll, přesunout fokus dovnitř, držet ho uvnitř
  // a po zavření ho vrátit na tlačítko, ze kterého se okno otevřelo.
  useEffect(() => {
    if (!activeService) return
    lastFocusedRef.current = document.activeElement as HTMLElement

    const focusables = () =>
      Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      )

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveService(null)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    focusables()[0]?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      lastFocusedRef.current?.focus()
    }
  }, [activeService])

  // Cena jednoho ošetření bez balíčku – proti ní se počítá sleva u větších poukazů.
  const basePricePerSession =
    settings.voucherPackages.find((p) => p.count === 1)?.pricePerSession ??
    Math.max(0, ...settings.voucherPackages.map((p) => p.pricePerSession))


  const highlightText = (text: string) => {
    if (!text) return '';
    const keywords = [
      'neinvazivní omlazující techniky',
      'neinvazivní omlazení',
      'tradiční čínské medicíny',
      'tradiční čínské metody',
      'přirozené kráse, zdraví a vnitřní rovnováze',
      'hlubokou relaxaci',
      'Gua Sha',
      'baňkování',
      'bukální masáže',
      'aurikuloterapii'
    ];
    let html = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      html = html.replace(regex, '<span class="text-highlight">$1</span>');
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <>
      <a href="#obsah" className="skip-link">Přeskočit na obsah</a>

      {/* Header */}
      <Header home />

      <main id="obsah">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content reveal reveal-fade">
            <span className="hero-tagline">{settings.heroTagline}</span>
            <h1>{settings.heroTitle}</h1>
            <p>{settings.heroDescription}</p>
            <div className="hero-buttons">
              <a href="#rezervace" className="btn btn-primary">Rezervovat ošetření</a>
              <a href="#sluzby" className="btn btn-outline">Naše služby</a>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span className="scroll-text">Objevte péči</span>
          <svg className="scroll-arrow" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="omne" className="section">
        {/* Botanical SVG background decoration */}
        <div className="botanical-decor botanical-decor-1">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.06">
            <path d="M50 95 C50 95, 20 60, 20 35 C20 15, 35 10, 50 35 C65 10, 80 15, 80 35 C80 60, 50 95, 50 95 Z" />
            <path d="M50 95 L50 35" />
            <path d="M50 80 Q35 70, 30 65" />
            <path d="M50 80 Q65 70, 70 65" />
            <path d="M50 65 Q35 55, 25 50" />
            <path d="M50 65 Q65 55, 75 50" />
            <path d="M50 50 Q35 40, 28 35" />
            <path d="M50 50 Q65 40, 72 35" />
          </svg>
        </div>
        <div className="container">
          <div className="grid grid-2 about-grid">
            <div className="about-image-wrapper reveal reveal-left">
              <img src={services.find(s => s.id === 'guasha')?.image || services[0]?.image} alt="Ošetření obličeje nefritovým kamenem Gua Sha v salonu NatureLift" className="about-image" loading="lazy" width="600" height="750" />
              <div className="about-badge">
                <div className="about-badge-num">{settings.aboutBadgeTitle}</div>
                <div className="about-badge-text">{settings.aboutBadgeText}</div>
              </div>
            </div>
            <div className="about-content reveal reveal-right">
              <h2>{settings.aboutTitle}</h2>
              <p>{highlightText(settings.aboutText1)}</p>
              <p>{highlightText(settings.aboutText2)}</p>
              <div className="about-quote">{settings.aboutQuote}</div>
              <p style={{ marginBottom: 0 }}>{highlightText(settings.aboutText3)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="sluzby" className="section section-bg">
        <div className="container">
          <div className="text-center services-intro reveal reveal-fade">
            <h2>{settings.servicesTitle}</h2>
            <p>{settings.servicesIntro}</p>
          </div>

          <div className="grid grid-2">
            {services.map((service) => (
              <div className="service-card reveal reveal-up" key={service.id}>
                <div className="service-image-container">
                  <img src={service.image} alt={service.title} loading="lazy" width="600" height="240" />
                </div>
                <div className="service-card-content">
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>
                    {service.tagline}
                  </span>
                  <h3>{service.title}</h3>
                  <div className="service-duration">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Doba ošetření: {service.duration}</span>
                  </div>
                  <p className="service-description">{service.shortDesc}</p>
                  <div className="service-card-footer">
                    <span className="service-price">{service.price}</span>
                    <button className="service-more-btn" onClick={() => setActiveService(service)}>
                      Více informací
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Natural Rejuvenation */}
      <section id="proc" className="section">
        <div className="container">
          <div className="why-section">
            <div className="grid grid-2 why-grid">
              <div className="reveal reveal-left">
                <h2>{settings.whyTitle}</h2>
                <p>{highlightText(settings.whyDescription1)}</p>
                <p>{highlightText(settings.whyDescription2)}</p>
                <p style={{ marginBottom: 0 }}>{highlightText(settings.whyDescription3)}</p>
              </div>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                <div className="why-card reveal reveal-up">
                  <div className="why-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 className="why-card-title">{settings.card1Title}</h3>
                  <p>{settings.card1Desc}</p>
                </div>
                <div className="why-card reveal reveal-up">
                  <div className="why-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h3 className="why-card-title">{settings.card2Title}</h3>
                  <p>{settings.card2Desc}</p>
                </div>
                <div className="why-card reveal reveal-up">
                  <div className="why-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h3 className="why-card-title">{settings.card3Title}</h3>
                  <p>{settings.card3Desc}</p>
                </div>
                <div className="why-card reveal reveal-up">
                  <div className="why-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                    </svg>
                  </div>
                  <h3 className="why-card-title">{settings.card4Title}</h3>
                  <p>{settings.card4Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="cenik" className="section section-bg">
        <div className="container">
          <div className="text-center pricing-intro reveal reveal-fade">
            <h2>{settings.pricingTitle}</h2>
            <p>{highlightText(settings.pricingDesc)}</p>
          </div>

          {settings.introOfferPrice > 0 && (
            <div className="intro-offer reveal reveal-up">
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
          )}

          <div className="pricing-table-container reveal reveal-up">
            {services.map((service) => (
              <div className="pricing-row" key={service.id}>
                <div className="pricing-info">
                  <div className="pricing-title">{service.title}</div>
                  <div className="pricing-desc">{service.tagline}</div>
                </div>
                <div className="pricing-meta">
                  <div className="pricing-time">{service.duration}</div>
                  <div className="pricing-price">{service.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Vouchers */}
      <section id="poukazy" className="section">
        <div className="container">
          <div className="text-center vouchers-intro reveal reveal-fade">
            <h2>{settings.vouchersTitle}</h2>
            <p>{settings.vouchersIntro}</p>
            {settings.vouchersScope && (
              <p className="vouchers-scope">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
                  <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
                <span>{settings.vouchersScope}</span>
              </p>
            )}
          </div>

          <div className="voucher-grid">
            {settings.voucherPackages.map((pkg) => {
              const total = pkg.count * pkg.pricePerSession
              const saving = basePricePerSession > pkg.pricePerSession
                ? Math.round((1 - pkg.pricePerSession / basePricePerSession) * 100)
                : 0

              return (
                <div
                  className={`voucher-card reveal reveal-up${pkg.highlight ? ' voucher-card-highlight' : ''}`}
                  key={`${pkg.count}-${pkg.pricePerSession}`}
                >
                  {pkg.highlight && <span className="voucher-badge">{pkg.badge || 'Nejčastější volba'}</span>}

                  <div className="voucher-count">
                    <span className="voucher-count-num">{pkg.count}×</span>
                    <span className="voucher-count-label">ošetření</span>
                  </div>

                  <h3 className="voucher-title">{pkg.title}</h3>
                  <p className="voucher-note">{pkg.note}</p>

                  <div className="voucher-pricing">
                    <div className="voucher-total">{formatCzk(total)}</div>
                    {pkg.count > 1 && (
                      <div className="voucher-per-session">
                        {formatCzk(pkg.pricePerSession)} za ošetření
                        {saving > 0 && <span className="voucher-saving">ušetříte {saving} %</span>}
                      </div>
                    )}
                  </div>

                  <a
                    href="#rezervace"
                    className={`btn ${pkg.highlight ? 'btn-primary' : 'btn-outline'} voucher-btn`}
                    onClick={() => setBookedService(voucherServiceId(pkg))}
                  >
                    Objednat poukaz
                  </a>
                </div>
              )
            })}
          </div>

          {settings.vouchersNote && (
            <p className="vouchers-fineprint reveal reveal-fade">{settings.vouchersNote}</p>
          )}
        </div>
      </section>

      {/* Contact & Booking Section */}
      <section id="kontakt" className="section">
        {/* Botanical SVG background decoration */}
        <div className="botanical-decor botanical-decor-2">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.05">
            <path d="M50 5 C50 5, 80 40, 80 65 C80 85, 65 90, 50 65 C35 90, 20 85, 20 65 C20 40, 50 5, 50 5 Z" />
            <path d="M50 5 L50 65" />
            <path d="M50 20 Q65 30, 70 35" />
            <path d="M50 20 Q35 30, 30 35" />
            <path d="M50 35 Q65 45, 75 50" />
            <path d="M50 35 Q35 45, 25 50" />
            <path d="M50 50 Q65 60, 72 65" />
            <path d="M50 50 Q35 60, 28 65" />
          </svg>
        </div>
        <div className="container">
          <div className="grid grid-2 contact-grid">
            {/* Contact Info */}
            <div className="contact-info-card reveal reveal-left">
              <h2 className="contact-info-title">{settings.contactTitle}</h2>
              <p>{settings.contactDesc}</p>

              <div className="contact-list">
                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-item-title">Terapeut</div>
                    <div className="contact-item-val">{settings.contactName}</div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-item-title">Kde mě najdete</div>
                    <div className="contact-item-val">{settings.contactAddress}</div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-item-title">Kdy se objednat</div>
                    <div className="contact-item-val contact-item-note">{settings.contactAvailability}</div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-item-title">Telefon</div>
                    <div className="contact-item-val">
                      <a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`}>{settings.contactPhone}</a>
                    </div>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <div className="contact-item-title">Email</div>
                    <div className="contact-item-val">
                      <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="reveal reveal-right">
              <BookingForm service={bookedService} onServiceChange={setBookedService} />
            </div>
          </div>

          {/* Map Embed - dynamická adresa z CMS */}
          <div className="map-container reveal reveal-up">
            <iframe
              title="Mapa provozovny"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.mapAddress || 'Poděbrady, Czech Republic')}&output=embed&hl=cs&z=15`}
              referrerPolicy="no-referrer-when-downgrade"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Service Details Modal */}
      {activeService && (
        <div className="modal-overlay" onClick={() => setActiveService(null)}>
          <div ref={modalRef} className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={activeService.title}>
            <button className="modal-close" onClick={() => setActiveService(null)} aria-label="Zavřít">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="modal-body">
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>
                {activeService.tagline}
              </span>
              <h2 className="modal-title">{activeService.title}</h2>
              <div className="modal-duration">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Doba ošetření: {activeService.duration}</span>
              </div>

              <p className="modal-text">{activeService.longDesc}</p>

              <h4 className="modal-subheader">Hlavní účinky ošetření</h4>
              <ul className="modal-list">
                {activeService.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>

              <div className="modal-contraindications">
                <div className="modal-contra-title">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" color="var(--accent)">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
                  </svg>
                  Kontraindikace (kdy ošetření neprovádět)
                </div>
                <p className="modal-contra-desc">{activeService.contraindications}</p>
              </div>

              <div className="modal-footer">
                <div>
                  <div className="modal-price-label">Cena za ošetření</div>
                  <div className="modal-price">{activeService.price}</div>
                </div>
                <a href="#rezervace" className="btn btn-primary" onClick={() => {
                  setBookedService(activeService.id)
                  setActiveService(null)
                }}>
                  Rezervovat termín
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
