# Architektura a technologie - Renata-web

Tento dokument popisuje technický stack, strukturu adresářů a designový systém projektu.

## Technologický Stack

* **Základ:** HTML5, CSS3, JavaScript ESNext.
* **Framework:** [React 19](https://react.dev/) s [TypeScript](https://www.typescriptlang.org/).
* **Build nástroj:** [Vite 8](https://vite.dev/) (velmi rychlý HMR a optimalizovaný build).
* **Styling:** **Vanilla CSS** s využitím CSS proměnných (CSS Custom Properties). Nepoužívá se TailwindCSS ani žádné preprocesory.
* **Ikony:** SVG ikony vložené přímo do kódu nebo jako inline komponenty (pro čistotu a nulové externí závislosti).
* **Obrázky:** Autentické obrázky generované pomocí AI nástrojů a uložené v `src/assets/`.

---

## Adresářová struktura

```text
Renata-web/
├── .git/                 # Git repozitář
├── docs/                 # Centrální dokumentace projektu
│   ├── index.md          # Rozcestník
│   ├── topology.md       # Hosting, domény, DNS
│   ├── architecture.md   # Tento soubor
│   ├── services.md       # Obsah, služby, ceník
│   └── secrets.md        # Lokální klíče (ignorováno v Gitu)
├── public/               # Statické soubory (favicon, manifest, atd.)
├── src/                  # Zdrojové soubory aplikace
│   ├── assets/           # Obrázky, ikony, lokální fonty
│   ├── components/       # Znovupoužitelné UI komponenty (Hero, Card, atd.)
│   ├── App.tsx           # Hlavní komponenta aplikace a rozvržení
│   ├── index.css         # Globální styly a design systém (proměnné)
│   ├── main.tsx          # Vstupní bod Reactu
│   └── vite-env.d.ts     # TypeScript deklarace pro Vite
├── .gitignore            # Ignorované soubory v Gitu
├── eslint.config.js      # Konfigurace ESLint
├── package.json          # Správa závislostí a skripty
├── tsconfig.json         # Konfigurace TypeScriptu
└── vite.config.ts        # Konfigurace Vite
```

---

## Design Systém & CSS Proměnné

Pro prémiový vzhled webu je v `src/index.css` definována následující paleta inspirovaná přírodou a wellness:

* **Základní pozadí (Cream):** `#FDFBF7` — velmi měkká krémová barva evokující čistotu.
* **Primární barva (Sage Green):** `#5D6D5F` / `#424E43` — pastelová, olivově zelená symbolizující byliny a přírodu.
* **Akcentní barva (Soft Gold):** `#D4AF37` / `#C5A059` — matná zlatá dodávající prémiovost a luxus.
* **Textová barva (Dark Charcoal):** `#2C332D` — tmavá zelenavě šedá, měkčí než čistá černá, pro snadnou čitelnost.
* **Efekt skla (Glassmorphism):** Využití `backdrop-filter: blur(10px)` s průhledným bílým pozadím pro navigační lištu a modální okna.
* **Typografie:** Moderní a elegantní bezpatkové fonty (např. *Outfit* nebo *Playfair Display* pro nadpisy, *Inter* nebo *Montserrat* pro tělo textu) importované z Google Fonts.
