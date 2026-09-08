import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

export interface Crumb {
  label: string
  href?: string
}

/**
 * Společný rám podstránek: hlavička, úvodní pruh s nadpisem a patička.
 *
 * Na rozdíl od úvodní stránky se tu nepoužívají třídy `reveal` – ty startují
 * s nulovou průhledností a obsah by bez JavaScriptu zůstal neviditelný.
 * U stránek, které mají hlavně dobře fungovat ve vyhledávání, to nestojí za to.
 */
export default function PageShell({
  title,
  lead,
  crumbs = [],
  children,
}: {
  title: string
  lead?: string
  crumbs?: Crumb[]
  children: ReactNode
}) {
  return (
    <>
      <a href="#obsah" className="skip-link">Přeskočit na obsah</a>
      <Header />

      <main id="obsah">
        <section className="subpage-hero">
          <div className="container">
            {crumbs.length > 0 && (
              <nav className="breadcrumbs" aria-label="Drobečková navigace">
                <ol>
                  <li><a href="/">Úvod</a></li>
                  {crumbs.map((crumb) => (
                    <li key={crumb.label}>
                      {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : <span aria-current="page">{crumb.label}</span>}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <h1 className="subpage-title">{title}</h1>
            {lead && <p className="subpage-lead">{lead}</p>}
          </div>
        </section>

        {children}
      </main>

      <Footer />
    </>
  )
}
