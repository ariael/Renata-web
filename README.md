# NatureLift – web (naturelift.help)

Jednostránkový prezentačně-rezervační web pro neinvazivní kosmeticko-terapeutické služby
inspirované tradiční čínskou medicínou (Gua Sha, baňkování obličeje, bukální masáže,
aurikuloterapie). Klientka: **Renata Tomášová, Poděbrady**.

## Tech stack

- **React 19 + TypeScript + Vite 8** – jednostránková aplikace ([src/App.tsx](src/App.tsx))
- **Vanilla CSS** s CSS proměnnými (světlý i tmavý režim), bez frameworku
- **Decap CMS** (Git-based) pro editaci obsahu bez kódu
- **Formspree** pro odesílání rezervačního formuláře
- Hosting **Netlify** (auto-deploy z větve `master`)

## Obsah a CMS

Obsah žije v JSON souborech, které edituje Decap CMS na `/admin/`:

- [src/data/settings.json](src/data/settings.json) – texty a kontaktní údaje úvodní stránky
- [src/data/services/](src/data/services/) – jedna služba = jeden `.json` soubor
- [src/fallbackData.ts](src/fallbackData.ts) – záložní data, pokud JSON chybí
- Obrázky: `public/assets/` (ve formátu **WebP**)

Po uložení v CMS vznikne commit na GitHubu → Netlify automaticky sestaví a nasadí web (~1–2 min).

## Vývoj

```bash
npm install      # instalace závislostí
npm run dev      # lokální vývojový server
npm run build    # produkční build (tsc + vite) do dist/
npm run preview  # náhled produkčního buildu
npm run lint     # ESLint
```

## Optimalizace obrázků

Obrázky se ukládají jako WebP (q80). Pro převod nových PNG/JPG lze jednorázově použít `sharp`:

```bash
npm install --no-save sharp
# poté skript, který načte zdroje a uloží *.webp do src/assets a public/assets
```

## Dokumentace

Podrobná projektová dokumentace je ve složce [docs/](docs/) – architektura, topologie/nasazení,
služby a ceník, nastavení CMS.
