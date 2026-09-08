import { services, servicePath, settings } from '../routes'
import PageShell from '../components/PageShell'

/**
 * Stránka pro neexistující adresu.
 *
 * Netlify ji vrací se stavovým kódem 404, takže si vyhledávač neuloží
 * překlep jako platnou stránku. Rozcestník je tu proto, aby návštěvník
 * nemusel začínat od začátku.
 */
export default function NotFoundPage() {
  return (
    <PageShell
      title="Tuhle stránku jsem nenašla"
      lead="Adresa nejspíš zestárla nebo se do ní vloudil překlep. Zkuste to odsud:"
    >
      <section className="section">
        <div className="container subpage-prose">
          <ul className="subpage-links">
            <li>
              <a href="/">
                <strong>Úvodní stránka</strong>
                <span>Přehled ošetření, ceník i rezervace</span>
              </a>
            </li>
            {services.map((service) => (
              <li key={service.id}>
                <a href={servicePath(service)}>
                  <strong>{service.title}</strong>
                  <span>{service.duration} · {service.price}</span>
                </a>
              </li>
            ))}
            <li>
              <a href="/darkovy-poukaz">
                <strong>Dárkový poukaz</strong>
                <span>Poukaz na jedno ošetření i na balíček</span>
              </a>
            </li>
            <li>
              <a href="/kontakt">
                <strong>Kontakt</strong>
                <span>{settings.contactPhone} · {settings.contactEmail}</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  )
}
