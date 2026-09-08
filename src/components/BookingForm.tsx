import React, { useState, useSyncExternalStore } from 'react'
import { services, settings } from '../routes'
import { formatCzk, voucherServiceId } from '../format'

/** Dnešní datum v místní zóně (toISOString by vrátil UTC a večer by povolil včerejšek). */
function localToday(): string {
  const d = new Date()
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().split('T')[0]
}

// Nejbližší možný termín zná až prohlížeč. Při buildu by se uložil den buildu
// a návštěvníkovi o týden později by formulář blokoval platné termíny.
const noSubscribe = () => () => {}
const clientToday = () => localToday()
const serverToday = () => ''

/**
 * Rezervační formulář. Používá ho úvodní stránka i podstránky, proto se dá
 * předvybrat služba – například ze stránky dárkového poukazu.
 */
/**
 * Vybranou sluzbu drzi rodic, aby ji sla predvyplnit zvenci - tlacitkem
 * u balicku poukazu, z detailu osetreni nebo rovnou ze stranky poukazu.
 */
export default function BookingForm({
  service,
  onServiceChange
}: {
  service: string
  onServiceChange: (value: string) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    referral: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)
  const [isFormSending, setIsFormSending] = useState(false)

  const todayStr = useSyncExternalStore(noSubscribe, clientToday, serverToday)

  // U objednávky poukazu nemá smysl vynucovat termín – ten si domluví obdarovaná.
  const isVoucherSelected = settings.voucherPackages.some(
    (p) => voucherServiceId(p) === service
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'service') {
      onServiceChange(value)
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsFormSending(true)
    setFormError(false)

    const selectedService = services.find(s => s.id === service)
    const selectedVoucher = settings.voucherPackages.find(p => voucherServiceId(p) === service)

    let serviceLabel = service
    if (selectedService) {
      serviceLabel = `${selectedService.title} (${selectedService.duration} / ${selectedService.price})`
    } else if (selectedVoucher) {
      const total = selectedVoucher.count * selectedVoucher.pricePerSession
      serviceLabel = `DÁRKOVÝ POUKAZ – ${selectedVoucher.title}, ${selectedVoucher.count}× ošetření za ${formatCzk(total)}`
    }

    // Past na roboty: pole je skryté, člověk ho nevyplní. Formspree takové
    // odeslání pod názvem `_gotcha` samo zahodí.
    const honeypot = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('input[name="_gotcha"]')?.value ?? ''

    try {
      const response = await fetch('https://formspree.io/f/mpqnbyqe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          jmeno: formData.name,
          email: formData.email,
          telefon: formData.phone,
          sluzba: serviceLabel,
          datum: formData.date,
          doporucila: formData.referral || '—',
          zprava: formData.message,
          _subject: selectedVoucher
            ? `Objednávka dárkového poukazu (${selectedVoucher.count}×) – ${formData.name}`
            : `Nová rezervace – ${formData.name}`,
          _gotcha: honeypot,
        }),
      })

      if (response.ok) {
        setFormSubmitted(true)
        setFormData({ name: '', email: '', phone: '', date: '', referral: '', message: '' })
        onServiceChange('')
      } else {
        setFormError(true)
      }
    } catch {
      setFormError(true)
    } finally {
      setIsFormSending(false)
    }
  }

  return (
    <div id="rezervace" className="booking-form">
      <h2 className="booking-form-title">{settings.bookingTitle}</h2>

      {isFormSending && (
        <div className="form-loading-overlay" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Odesílám rezervaci...</p>
        </div>
      )}

      {formSubmitted && (
        <div className="form-success-message animate-success" role="status" aria-live="polite">
          <div className="success-checkmark">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="3" fill="none">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" className="checkmark-circle" />
              <polyline points="22 4 12 14.01 9 11.01" className="checkmark-check" />
            </svg>
          </div>
          <div style={{ fontWeight: '600', fontSize: '1.2rem', marginTop: '0.5rem' }}>{settings.bookingSuccessTitle}</div>
          <p style={{ fontSize: '0.95rem', margin: '0.5rem 0 0', color: 'inherit', opacity: 0.9 }}>
            {settings.bookingSuccessText}
          </p>
        </div>
      )}

      {formError && (
        <div className="form-error-message" role="alert">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Odeslání se nezdařilo. Zkuste to prosím znovu nebo nás kontaktujte přímo na <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ opacity: isFormSending || formSubmitted ? 0.3 : 1, transition: 'opacity 0.3s ease', pointerEvents: isFormSending || formSubmitted ? 'none' : 'auto' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Jméno a příjmení</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="form-control"
            placeholder="Např. Jana Nováková"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="form-control"
              placeholder="jmeno@seznam.cz"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="form-control"
              placeholder="777 123 456"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="service">Požadovaná služba</label>
            <select
              id="service"
              name="service"
              required
              className="form-control"
              value={service}
              onChange={handleInputChange}
            >
              <option value="">Vyberte ošetření...</option>
              <optgroup label="Ošetření">
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.duration} / {s.price})
                  </option>
                ))}
              </optgroup>
              {settings.voucherPackages.length > 0 && (
                <optgroup label="Dárkové poukazy">
                  {settings.voucherPackages.map((pkg) => (
                    <option key={voucherServiceId(pkg)} value={voucherServiceId(pkg)}>
                      Poukaz – {pkg.title} ({pkg.count}× / {formatCzk(pkg.count * pkg.pricePerSession)})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="date">
              Preferované datum{isVoucherSelected && <span className="form-label-optional"> (nepovinné)</span>}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required={!isVoucherSelected}
              min={todayStr || undefined}
              className="form-control"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="referral">
            Kdo vás doporučil? <span className="form-label-optional">(nepovinné)</span>
          </label>
          <input
            type="text"
            id="referral"
            name="referral"
            className="form-control"
            placeholder="Např. Jana Nováková"
            value={formData.referral}
            onChange={handleInputChange}
          />
          <p className="form-field-hint">
            Díky tomu můžu uplatnit zaváděcí cenu vám i té, která vás poslala.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">Poznámka / doplňující informace</label>
          <textarea
            id="message"
            name="message"
            className="form-control"
            placeholder="Máte-li jakékoliv dotazy k termínu nebo kontraindikacím, napište je sem..."
            value={formData.message}
            onChange={handleInputChange}
          />
        </div>

        {/* Past na roboty – pro člověka neviditelná, proto i aria-hidden. */}
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hp-field"
        />

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          Odeslat nezávaznou rezervaci
        </button>

        <p className="form-privacy-note">
          Odesláním formuláře berete na vědomí, že {settings.contactName} zpracuje uvedené
          osobní údaje (jméno, e-mail, telefon) výhradně za účelem domluvy termínu ošetření.
          Údaje nepředáváme třetím stranám a smažeme je, jakmile přestanou být potřeba.
          Kdykoliv můžete požádat o jejich výmaz na{' '}
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.
        </p>
      </form>
    </div>
  )
}
