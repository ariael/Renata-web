# Redakční systém (CMS) - Decap CMS

Tento dokument slouží jako příručka pro nastavení a používání bezserverového redakčního systému **Decap CMS** na webu `naturelift.help`.

## Architektura a princip fungování

CMS funguje na principu **Git-based CMS** (JAMstack). Nemáme žádný samostatný server ani databázi:
1. Když administrátor přejde na adresu `/admin/` a přihlásí se, Decap CMS se spojí s GitHub repozitářem.
2. Při uložení změn v administraci se na GitHubu automaticky vytvoří nový commit s aktualizovanými JSON soubory (ve složce `src/data/`).
3. GitHub spustí webhook, který informuje hosting (Netlify nebo Vercel).
4. Hosting automaticky sestaví (build) a nasadí novou statickou verzi webu. Celý proces trvá přibližně 1 až 2 minuty.

---

## Postup nastavení (Jednorázové)

### Možnost A: Nasazení na Netlify (Doporučeno a nejjednodušší)

Pokud je projekt hostován na Netlify, je nastavení autentizace plně zdarma a zabere 2 minuty:

1. **Aktivace Netlify Identity**:
   * Přejděte do administrace svého projektu na Netlify.
   * V záložce **Site configuration** -> **Identity** klikněte na **Enable Identity**.
   * V nastavení Identity (Registration) zvolte **Open** (otevřené pro registraci) nebo **Invite only** (registrace pouze na pozvání - doporučeno pro vyšší bezpečnost).
2. **Aktivace Git Gateway**:
   * Sjeďte dolů v nastavení Identity k části **Services** -> **Git Gateway**.
   * Klikněte na **Enable Git Gateway** a propojte ji se svým GitHub účtem (tím se umožní CMS provádět commity jménem přihlášených uživatelů).
3. **První přihlášení**:
   * Přejděte na `https://vase-domena.cz/admin/`.
   * Zaregistrujte se (pokud je povolena otevřená registrace) nebo se přihlaste přes pozvánku zaslanou z Netlify panelu.
   * Po registraci a ověření e-mailu se doporučuje přepnout nastavení Identity zpět na **Invite only**, aby se nemohli registrovat cizí lidé.

### Možnost B: Nasazení na Vercel (GitHub OAuth)

Pokud je projekt na Vercelu, musíme použít externí OAuth bránu pro GitHub, protože Vercel nemá vestavěnou službu Identity:

1. **Vytvoření OAuth aplikace na GitHubu**:
   * Přejděte na GitHub -> **Settings** -> **Developer Settings** -> **OAuth Apps** -> **New OAuth App**.
   * **Homepage URL**: `https://www.naturelift.help`
   * **Authorization callback URL**: `https://api.netlify.com/auth/handler` (pokud se používá výchozí Netlify gateway) nebo adresa vaší vlastní proxy.
2. **Nastavení proxy**:
   * Lze použít bezplatnou bránu, např. [decap-cms-oauth](https://github.com/vnglst/decap-cms-oauth) nebo využít hotovou službu jako `https://oauth.decapcms.org`.
   * V souboru [config.yml](file:///c:/GitHub/Renata-web/public/admin/config.yml) by se pak upravila konfigurace `backend` na:
     ```yaml
     backend:
       name: github
       repo: ariael/Renata-web
       branch: master
       api_root: https://api.github.com
       site_domain: www.naturelift.help
       base_url: https://auth.vaše-brána.cz
     ```

---

## Datová struktura v projektu

CMS přímo upravuje tyto soubory v repozitáři:

* **Nastavení a texty webu**: [src/data/settings.json](file:///c:/GitHub/Renata-web/src/data/settings.json)
  * Obsahuje veškeré statické texty pro Hero sekci, O mně, Proč přirozeně, ceník a kontaktní údaje.
* **Služby (Služby)**: [src/data/services/](file:///c:/GitHub/Renata-web/src/data/services/)
  * Každá služba (např. Gua Sha) je uložena jako samostatný soubor `.json` (např. `guasha.json`). Obsahuje název, cenu, dobu trvání, popis, seznam výhod a kontraindikace.
* **Obrázky a média**: [public/assets/](file:///c:/GitHub/Renata-web/public/assets/)
  * Sem se ukládají všechny obrázky nahrané přes CMS. V JSON souborech se na ně odkazuje jako na `/assets/nazev-souboru.jpg`.

---

## Příručka pro uživatele (Jak měnit texty)

1. Přejděte na adresu: `https://www.naturelift.help/admin/`.
2. Přihlaste se svými údaji (e-mail a heslo nastavené při registraci).
3. V levém menu uvidíte dvě sekce:
   * **Služby (Services)**: Zde můžete přidávat nové služby, upravovat stávající (měnit ceny, trvání, popisky, obrázky) nebo je mazat.
   * **Nastavení webu (Settings)**: Zde klikněte na položku **Úvodní stránka** a můžete upravit veškeré texty a kontaktní údaje na webu.
4. Po provedení změn klikněte v horní liště na zelené tlačítko **Publish** (Publikovat).
5. Změny se na webu projeví přibližně za **1 až 2 minuty** (jakmile doběhne automatický build na pozadí). Průběh buildu můžete sledovat v administraci Netlify/Vercel.
