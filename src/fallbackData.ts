import heroBgImg from './assets/hero_bg.webp'
import guaShaImg from './assets/gua_sha_treatment.webp'
import buccalMassageImg from './assets/buccal_massage.webp'
import auriculotherapyImg from './assets/auriculotherapy.webp'

export interface Service {
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
  sortOrder?: number
}

export interface HomepageSettings {
  heroTagline: string
  heroTitle: string
  heroDescription: string
  aboutTitle: string
  aboutText1: string
  aboutText2: string
  aboutQuote: string
  aboutText3: string
  whyTitle: string
  whyDescription1: string
  whyDescription2: string
  whyDescription3: string
  card1Title: string
  card1Desc: string
  card2Title: string
  card2Desc: string
  card3Title: string
  card3Desc: string
  card4Title: string
  card4Desc: string
  pricingTitle: string
  pricingDesc: string
  contactTitle: string
  contactDesc: string
  contactName: string
  contactAddress: string
  contactPhone: string
  contactEmail: string
  mapAddress: string
}

export const SERVICES_FALLBACK_DATA: Service[] = [
  {
    id: 'buccal',
    title: 'Bukální masáž obličeje',
    tagline: 'Neinvazivní omlazení & modelování',
    duration: '60 min',
    price: '1 200 Kč',
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
    contraindications: 'Akutní záněty či rány v ústní dutině, afty, herpes, čerstvé stomatologické zákroky, nedávné estetické zákroky (aplikace nití, botoxu či výplní - odstup min. 4–6 týdnů).',
    sortOrder: 1
  },
  {
    id: 'guasha',
    title: 'Masáž Gua Sha',
    tagline: 'Tradiční čínský rituál omlazení',
    duration: '60 min',
    price: '700 Kč',
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
    contraindications: 'Akutní akné, zánětlivá onemocnění kůže v obličeji, popáleniny od slunce, otevřené ranky, křečové žíly nebo křehké cévky v obličeji.',
    sortOrder: 2
  },
  {
    id: 'cupping',
    title: 'Baňkování obličeje',
    tagline: 'Hloubkové prokrvení & zpevnění',
    duration: '60 min',
    price: '600 Kč',
    image: heroBgImg,
    shortDesc: 'Neinvazivní ošetření speciálními baňkami, které prokrvuje pokožku do hloubky, odstraňuje svalové blokády a čistí póry.',
    longDesc: 'Baňkování obličeje (facial cupping) využívá jemné podtlakové baňky navržené speciálně pro citlivou pokožku obličeje a dekoltu. Podtlak stimuluje krevní oběh v nejhlubších vrstvách kůže, okysličuje tkáně a urychluje odvod metabolických odpadů lymfatickým systémem. V kombinaci s Gua Sha masáží dosahuje mimořádně zpevňujících výsledků.',
    benefits: [
      'Hloubkově čistí pleť a zabraňuje rozšiřování pórů',
      'Prokrvuje obličej v hlubších vrstvách pokožky',
      'Zlepšuje elasticitu pokožky a stimuluje regenerační procesy',
      'Zanechává pleť zpevněnou, hladkou a odpočatou'
    ],
    contraindications: 'Křehké cévky (kuperóza), tenká a velmi citlivá pleť, akutní kožní záněty, čerstvé jizvy nebo výplně.',
    sortOrder: 3
  },
  {
    id: 'auriculo',
    title: 'Aurikuloterapie',
    tagline: 'Harmonizace těla přes body na uchu',
    duration: '30 min',
    price: '250 Kč',
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
    contraindications: 'Těhotenství (některé body jsou kontraindikovány), akutní zánět nebo poranění ušního boltce, kovové alergie (pokud se používají magnetické kuličky).',
    sortOrder: 4
  }
]

export const HOMEPAGE_SETTINGS_FALLBACK: HomepageSettings = {
  heroTagline: 'Přírodní omlazení v Poděbradech',
  heroTitle: 'Cesta k přirozené kráse, zdraví a harmonii',
  heroDescription: 'Objevte vysoce účinné terapeutické techniky inspirované tradiční čínskou medicínou a přirozenou regenerací těla. Navraťte své pleti mladistvý vzhled a uvolněte mysl.',
  aboutTitle: 'O mně',
  aboutText1: 'Jmenuji se Renata Tomášová a pomáhám lidem nacházet cestu zpět k jejich přirozené kráse, zdraví a vnitřní rovnováze. Při své práci se specializuji na neinvazivní omlazující techniky obličeje a na jemné harmonizační metody tradiční čínské medicíny.',
  aboutText2: 'Věřím, že stav naší pokožky je zrcadlem našeho vnitřního zdraví a psychické pohody. Proto ke každému klientovi přistupuji s maximální citlivostí, respektem a individuální péčí přizpůsobenou konkrétním potřebám jeho těla i mysli.',
  aboutQuote: '„Krása nevzniká na povrchu, ale pramení z hlubokého uvolnění napětí a harmonie celého těla.“',
  aboutText3: 'Přijďte si dopřát chvíli péče do salonu v Poděbradech, kde zažijete hlubokou relaxaci obličejových svalů, oživíte povadlé fascie a podpoříte celkovou vitalitu organismu.',
  whyTitle: 'Co se děje s naším obličejem, když stárneme?',
  whyDescription1: 'Mladý obličej má pevné svaly, neporušené fascie, dobře fungující tok lymfy a pružné cévky. Čím jsme starší, tím větší podporu od nás naše pleť potřebuje.',
  whyDescription2: 'Chronické napětí se hromadí zejména v čelistech, kolem rtů a na čele, což vede k vzniku hlubokých vrásek. Postupně klesá hustota kostí, ochabuje svalstvo a dochází k poklesu kontur obličeje. Lymfatický oběh se zpomaluje, což způsobuje ranní otoky a nezdravý tón pleti.',
  whyDescription3: 'Naše přirozené, neinvazivní omlazující techniky (Gua Sha, baňkování, bukální masáže) působí v nejhlubších vrstvách kůže, svalů i pojivových tkání. Oživují zanedbané oblasti a spouští ozdravné procesy celého organismu.',
  card1Title: 'Aktivace kolagenu',
  card1Desc: 'Hloubková masáž stimuluje fibroblasty k tvorbě nového kolagenu a elastinu pro zpevnění pleti.',
  card2Title: 'Lymfatický odtok',
  card2Desc: 'Uvolněním napjatých fascií rozproudíme tok lymfy, což eliminuje otoky a vyčistí pokožku.',
  card3Title: 'Uvolnění stresu',
  card3Desc: 'Jemná stimulace bodů na uchu a uvolnění čelistního napětí působí blahodárně na celou psychiku.',
  card4Title: 'Bez jehel a chemie',
  card4Desc: 'Stoprocentně přírodní, neinvazivní ošetření bez rizika vedlejších účinků či nepřirozeného vzhledu.',
  pricingTitle: 'Ceník služeb',
  pricingDesc: 'Investice do vašeho zdraví, krásy a harmonie. Dopřejte si prémiovou péči, kterou si vaše pleť zaslouží. Při zakoupení balíčku více ošetření nabízíme individuální ceny.',
  contactTitle: 'Kontakt',
  contactDesc: 'Pokud máte jakékoliv dotazy k nabízeným procedurám nebo kontraindikacím, neváhejte mě kontaktovat. Ráda vám poradím a pomohu vybrat ošetření na míru.',
  contactName: 'Renata Tomášová',
  contactAddress: 'Poděbrady',
  contactPhone: '+420 733 783 125',
  contactEmail: 'renata.tomasova@seznam.cz',
  mapAddress: 'Poděbrady, Czech Republic'
}
