import { useState, useEffect } from 'react'
import { LogoMark } from '../Logo'
import { settings } from '../routes'

/**
 * Hlavička webu.
 *
 * Odkazy v menu míří na sekce úvodní stránky. Zapisují se absolutně
 * (`/#cenik`), aby fungovaly i z podstránek – na úvodní stránce je prohlížeč
 * vyhodnotí jako odkaz v rámci téhož dokumentu a jen odroluje, odjinud
 * nejdřív načtou úvodní stránku.
 */
const NAV_ITEMS = [
  { href: '/#omne', label: 'O mně' },
  { href: '/#sluzby', label: 'Služby' },
  { href: '/#proc', label: 'Proč přirozeně' },
  { href: '/#cenik', label: 'Ceník' },
  { href: '/darkovy-poukaz', label: 'Poukazy' },
  { href: '/#kontakt', label: 'Kontakt' },
]

export default function Header({ home = false }: { home?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Otevřené menu zavřít Escapem a nenechat rolovat stránkou pod ním.
  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="container nav-container">
        <a
          href={home ? '#' : '/'}
          className="logo-link"
          onClick={closeMenu}
          aria-label="NatureLift – úvodní stránka"
        >
          <LogoMark className="logo-mark" size={44} />
          <span className="logo-words">
            <span className="logo-title">NatureLift</span>
            <span className="logo-subtitle">{settings.contactName}</span>
          </span>
        </a>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
          aria-expanded={isMenuOpen}
          aria-controls="hlavni-menu"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>

        <nav aria-label="Hlavní navigace">
          <ul id="hlavni-menu" className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <li className="nav-item" key={item.href}>
                <a href={item.href} onClick={closeMenu}>{item.label}</a>
              </li>
            ))}
            <li className="nav-item">
              <a
                href="/#rezervace"
                className="btn btn-accent"
                onClick={closeMenu}
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.95rem' }}
              >
                Rezervace
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
