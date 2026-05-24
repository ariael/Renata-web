import React, { useState } from 'react'
import './App.css'

// Import assets
import heroBgImg from './assets/hero_bg.png'
import guaShaImg from './assets/gua_sha_treatment.png'
import buccalMassageImg from './assets/buccal_massage.png'
import auriculotherapyImg from './assets/auriculotherapy.png'

interface Service {
  id: string
  title: string
  tagline: string
  duration: string
  price: string
  image: string
  shortDesc: string
  longDesc: string
  benefits: string[]
  contraindications: string
}

const SERVICES_DATA: Service[] = [
  {
    id: 'buccal',
    title: 'Bukální masáž obličeje',
    tagline: 'Neinvazivní omlazení & modelování',
    duration: '75 min',
    price: '1 800 Kč',
    image: buccalMassageImg,
    shortDesc: 'Hloubková intraorální masáž svalů a fascií obličeje, krku a dekoltu. Unikátní ošetření zvenčí i zevnitř úst pro okamžitý lifting.',
    longDesc: 'Bukální masáž (skulpturálně-intraorální lifting) patří mezi nejúčinnější neinvazivní omlazující techniky obličeje a krku. Ošetření probíhá ve dvou fázích: první fáze probíhá zvenčí na dekoltu, krku a obličeji; druhá fáze probíhá uvnitř úst (s použitím jednorázových sterilních rukavic). Tímto způsobem terapeut uvolní i hluboko uložené napjaté svaly, zejména v oblasti čelistí, což zmírňuje chronické napětí a redukuje vrásky.',
    benefits: [
      'Redukuje povislé kontury obličeje a zmenšuje dvojitou bradu',
      'Obnovuje přirozenou pružnost, tonus a pevnost pleti',
      'Uvolňuje napětí obličejových svalů (ideální při stresu a skřípání zubů - bruxismu)',
      'Podporuje intenzivní lymfatickou drenáž a redukuje otoky',
      'Vyhlazuje nasolabiální záhyby a vrásky kolem úst',
      'Zabraňuje poklesu koutků úst'
    ],
    contraindications: 'Akutní záněty či rány v ústní dutině, afty, herpes, čerstvé stomatologické zákroky, nedávné estetické zákroky (aplikace nití, botoxu či výplní - odstup min. 4–6 týdnů).'
  },
  {
    id: 'guasha',
    title: 'Masáž Gua Sha',
    tagline: 'Tradiční čínský rituál omlazení',
    duration: '60 min',
    price: '1 200 Kč',
    image: guaShaImg,
    shortDesc: 'Vysoce relaxační ošetření nefritovými kameny stimulující tvorbu kolagenu a lymfatický oběh pro zářivou a vyžehlenou pleť.',
    longDesc: 'Gua Sha je tradiční čínská terapeutická metoda stará více než 2000 let. Používáním speciálně tvarovaných destiček z polodrahokamů (nejčastěji nefritu nebo růženínu) jemnými tahy masírujeme pokožku obličeje podél energetických drah. Masáž aktivuje fascie, rozproudí lymfatický oběh, čistí tkáně od toxinů a přirozeně stimuluje produkci vlastního kolagenu a elastinu.',
    benefits: [
      'Zajišťuje vyšší tvorbu kolagenu a elastinu',
      'Zvyšuje pružnost a zářivost pleti (tzv. "vyžehlený vzhled")',
      'Odstraňuje otoky a váčky pod očima',
      'Zlepšuje mikrocirkulaci a výživu kožních buněk',
      'Uvolňuje napětí v oblasti čela, obočí a spánků'
    ],
    contraindications: 'Akutní akné, zánětlivá onemocnění kůže v obličeji, popáleniny od slunce, otevřené ranky, křečové žíly nebo křehké cévky v obličeji.'
  },
  {
    id: 'cupping',
    title: 'Baňkování obličeje',
    tagline: 'Hloubkové prokrvení & zpevnění',
    duration: '45 min',
    price: '1 100 Kč',
    image: heroBgImg,
    shortDesc: 'Neinvazivní ošetření speciálními baňkami, které prokrvuje pokožku do hloubky, odstraňuje svalové blokády a čistí póry.',
    longDesc: 'Baňkování obličeje (facial cupping) využívá jemné podtlakové baňky navržené speciálně pro citlivou pokožku obličeje a dekoltu. Podtlak stimuluje krevní oběh v nejhlubších vrstvách kůže, okysličuje tkáně a urychluje odvod metabolických odpadů lymfatickým systémem. V kombinaci s Gua Sha masáží dosahuje mimořádně zpevňujících výsledků.',
    benefits: [
      'Hloubkově čistí pleť a zabraňuje rozšiřování pórů',
      'Prokrvuje obličej v hlubších vrstvách pokožky',
      'Zlepšuje elasticitu pokožky a stimuluje regenerační procesy',
      'Zanechává pleť zpevněnou, hladkou a odpočatou'
    ],
    contraindications: 'Křehké cévky (kuperóza), tenká a velmi citlivá pleť, akutní kožní záněty, čerstvé jizvy nebo výplně.'
  },
  {
    id: 'auriculo',
    title: 'Aurikuloterapie',
    tagline: 'Harmonizace těla přes body na uchu',
    duration: '45 min',
    price: '800 Kč',
    image: auriculotherapyImg,
    shortDesc: 'Jemná ušní akupresura s využitím magnetických kuliček pro nastartování přirozené regenerace a psychické i fyzické rovnováhy.',
    longDesc: 'Aurikuloterapie (ušní akupunktura/akupresura) je uznávaná metoda tradiční čínské medicíny (TCM). Ušní boltec představuje mikrosystém celého lidského těla. Stimulací specifických bodů na uchu (pomocí neinvazivních drobných magnetických kuliček nebo semínek vaccaria, které se na uchu nechávají působit několik dní) dochází k harmonizaci funkcí vnitřních orgánů, nervové soustavy a zmírnění potíží v celém těle.',
    benefits: [
      'Pomáhá při stresu, úzkostech a psychickém vyčerpání',
      'Zlepšuje kvalitu spánku, pomáhá při nespavosti a únavě',
      'Uvolňuje bolesti hlavy, zad a pohybového aparátu',
      'Podporuje metabolismus, hubnutí a zvládání chutí',
      'Pomáhá při odvykání kouření a harmonizuje trávení'
    ],
    contraindications: 'Těhotenství (některé body jsou kontraindikovány), akutní zánět nebo poranění ušního boltce, kovové alergie (pokud se používají magnetické kuličky).'
  }
]

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulace odeslání rezervačního formuláře
    console.log('Rezervace odeslána:', formData)
    setFormSubmitted(true)
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      message: ''
    })
    setTimeout(() => {
      setFormSubmitted(false)
    }, 8000)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      {/* Header */}
      <header>
        <div className="container nav-container">
          <a href="#" className="logo-link" onClick={closeMenu}>
            <span className="logo-title">NatureLift</span>
            <span className="logo-subtitle">Renata Tomášová</span>
          </a>

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Menu">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>

          <nav>
            <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
              <li className="nav-item">
                <a href="#omne" onClick={closeMenu}>O mně</a>
              </li>
              <li className="nav-item">
                <a href="#sluzby" onClick={closeMenu}>Služby</a>
              </li>
              <li className="nav-item">
                <a href="#proc" onClick={closeMenu}>Proč přirozeně</a>
              </li>
              <li className="nav-item">
                <a href="#cenik" onClick={closeMenu}>Ceník</a>
              </li>
              <li className="nav-item">
                <a href="#kontakt" onClick={closeMenu}>Kontakt</a>
              </li>
              <li className="nav-item">
                <a href="#rezervace" className="btn btn-accent" onClick={closeMenu} style={{ padding: '0.5rem 1.5rem', fontSize: '0.95rem' }}>
                  Rezervace
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <span className="hero-tagline">Přírodní omlazení v Poděbradech</span>
            <h1>Cesta k přirozené kráse, zdraví a harmonii</h1>
            <p>
              Objevte vysoce účinné terapeutické techniky inspirované tradiční čínskou medicínou a přirozenou regenerací těla. 
              Navraťte své pleti mladistvý vzhled a uvolněte mysl.
            </p>
            <div className="hero-buttons">
              <a href="#rezervace" className="btn btn-primary">Rezervovat ošetření</a>
              <a href="#sluzby" className="btn btn-outline">Naše služby</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="omne" className="section">
        <div className="container">
          <div className="grid grid-2 about-grid">
            <div className="about-image-wrapper">
              <img src={guaShaImg} alt="Renata Tomášová - NatureLift" className="about-image" />
              <div className="about-badge">
                <div className="about-badge-num">TCM</div>
                <div className="about-badge-text">Tradiční čínské metody</div>
              </div>
            </div>
            <div className="about-content">
              <h2>O mně</h2>
              <p>
                Jmenuji se <strong>Renata Tomášová</strong> a pomáhám lidem nacházet cestu zpět k jejich přirozené kráse, zdraví a vnitřní rovnováze. 
                Při své práci se specializuji na neinvazivní omlazující techniky obličeje a na jemné harmonizační metody tradiční čínské medicíny.
              </p>
              <p>
                Věřím, že stav naší pokožky je zrcadlem našeho vnitřního zdraví a psychické pohody. Proto ke každému klientovi přistupuji 
                s maximální citlivostí, respektem a individuální péčí přizpůsobenou konkrétním potřebám jeho těla i mysli.
              </p>
              <div className="about-quote">
                „Krása nevzniká na povrchu, ale pramení z hlubokého uvolnění napětí a harmonie celého těla.“
              </div>
              <p style={{ marginBottom: 0 }}>
                Přijďte si dopřát chvíli péče do salonu v Poděbradech, kde zažijete hlubokou relaxaci obličejových svalů, 
                oživíte povadlé fascie a podpoříte celkovou vitalitu organismu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="sluzby" className="section section-bg">
        <div className="container">
          <div className="text-center services-intro">
            <h2>Naše služby</h2>
            <p>
              Každá procedura je prováděna s důrazem na detail a relaxační zážitek. Spojuji staleté zkušenosti 
              čínské medicíny s moderními poznatky o fasciích a svalové struktuře obličeje.
            </p>
          </div>

          <div className="grid grid-2">
            {SERVICES_DATA.map((service) => (
              <div className="service-card" key={service.id}>
                <div className="service-image-container">
                  <img src={service.image} alt={service.title} />
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
              <div>
                <h2>Co se děje s naším obličejem, když stárneme?</h2>
                <p>
                  Mladý obličej má pevné svaly, neporušené fascie, dobře fungující tok lymfy a pružné cévky. Čím jsme starší, tím větší podporu od nás naše pleť potřebuje.
                </p>
                <p>
                  Chronické napětí se hromadí zejména v čelistech, kolem rtů a na čele, což vede k vzniku hlubokých vrásek. Postupně klesá hustota kostí, ochabuje svalstvo a dochází k poklesu kontur obličeje. Lymfatický oběh se zpomaluje, což způsobuje ranní otoky a nezdravý tón pleti.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Naše přirozené, neinvazivní omlazující techniky (Gua Sha, baňkování, bukální masáže) působí v nejhlubších vrstvách kůže, svalů i pojivových tkání. Oživují zanedbané oblasti a spouští ozdravné procesy celého organismu.
                </p>
              </div>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                <div className="why-card">
                  <div className="why-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h4>Aktivace kolagenu</h4>
                  <p>Hloubková masáž stimuluje fibroblasty k tvorbě nového kolagenu a elastinu pro zpevnění pleti.</p>
                </div>
                <div className="why-card">
                  <div className="why-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h4>Lymfatický odtok</h4>
                  <p>Uvolněním napjatých fascií rozproudíme tok lymfy, což eliminuje otoky a vyčistí pokožku.</p>
                </div>
                <div className="why-card">
                  <div className="why-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <h4>Uvolnění stresu</h4>
                  <p>Jemná stimulace bodů na uchu a uvolnění čelistního napětí působí blahodárně na celou psychiku.</p>
                </div>
                <div className="why-card">
                  <div className="why-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                    </svg>
                  </div>
                  <h4>Bez jehel a chemie</h4>
                  <p>Stoprocentně přírodní, neinvazivní ošetření bez rizika vedlejších účinků či nepřirozeného vzhledu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="cenik" className="section section-bg">
        <div className="container">
          <div className="text-center pricing-intro">
            <h2>Ceník služeb</h2>
            <p>
              Investice do vašeho zdraví, krásy a harmonie. Dopřejte si prémiovou péči, kterou si vaše pleť zaslouží. 
              Při zakoupení balíčku více ošetření nabízíme individuální ceny.
            </p>
          </div>

          <div className="pricing-table-container">
            {SERVICES_DATA.map((service) => (
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
            <div className="pricing-row">
              <div className="pricing-info">
                <div className="pricing-title">Kombinované ošetření (Gua Sha + Baňkování)</div>
                <div className="pricing-desc">Intenzivní omlazující a zpevňující kúra pro náročné</div>
              </div>
              <div className="pricing-meta">
                <div className="pricing-time">90 min</div>
                <div className="pricing-price">2 100 Kč</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Booking Section */}
      <section id="kontakt" className="section">
        <div className="container">
          <div className="grid grid-2 contact-grid">
            {/* Contact Info */}
            <div className="contact-info-card">
              <h2 className="contact-info-title">Kontakt</h2>
              <p>
                Pokud máte jakékoliv dotazy k nabízeným procedurám nebo kontraindikacím, neváhejte mě kontaktovat. 
                Ráda vám poradím a pomohu vybrat ošetření na míru.
              </p>

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
                    <div className="contact-item-val">Renata Tomášová</div>
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
                    <div className="contact-item-val">Poděbrady</div>
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
                      <a href="tel:+420733783125">+420 733 783 125</a>
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
                      <a href="mailto:renata.tomasova@seznam.cz">renata.tomasova@seznam.cz</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div id="rezervace" className="booking-form">
              <h2 className="booking-form-title">Rezervace termínu</h2>
              {formSubmitted ? (
                <div className="form-success-message">
                  <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <div>Děkujeme za váš zájem!</div>
                  <p style={{ fontSize: '0.95rem', margin: '0.5rem 0 0', color: 'inherit' }}>
                    Rezervační formulář byl úspěšně odeslán. Renata vás bude kontaktovat telefonicky nebo e-mailem pro potvrzení přesného času ošetření.
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
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
                      value={formData.service}
                      onChange={handleInputChange}
                    >
                      <option value="">Vyberte ošetření...</option>
                      <option value="bukal">Bukální masáž (75 min / 1 800 Kč)</option>
                      <option value="guasha">Masáž Gua Sha (60 min / 1 200 Kč)</option>
                      <option value="cupping">Baňkování obličeje (45 min / 1 100 Kč)</option>
                      <option value="auriculo">Aurikuloterapie (45 min / 800 Kč)</option>
                      <option value="kombi">Kombinované ošetření (90 min / 2 100 Kč)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="date">Preferované datum</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      className="form-control"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
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

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Odeslat nezávaznou rezervaci
                </button>
              </form>
            </div>
          </div>

          {/* Map Embed (Poděbrady) using OpenStreetMap iframe */}
          <div className="map-container">
            <iframe
              title="Mapa Poděbrady"
              src="https://www.openstreetmap.org/export/embed.html?bbox=15.100989341735842%2C50.13459196395353%2C15.148110389709474%2C50.15175960010834&amp;layer=mapnik&amp;marker=50.14317823908846%2C15.124549865722656"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-logo">NatureLift</div>
          <div className="footer-subtitle">Renata Tomášová</div>
          <ul className="footer-nav">
            <li><a href="#omne">O mně</a></li>
            <li><a href="#sluzby">Služby</a></li>
            <li><a href="#proc">Proč přirozeně</a></li>
            <li><a href="#cenik">Ceník</a></li>
            <li><a href="#kontakt">Kontakt</a></li>
          </ul>
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} NatureLift.help. Všechna práva vyhrazena. 
            <br />
            <span style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.5rem', display: 'block' }}>
              Inspirováno tradiční čínskou medicínou a péčí o zdraví.
            </span>
          </div>
        </div>
      </footer>

      {/* Service Details Modal */}
      {activeService && (
        <div className="modal-overlay" onClick={() => setActiveService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                  setFormData((prev) => ({ ...prev, service: activeService.id }))
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
