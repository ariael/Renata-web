# Topologie a nasazení - Renata-web

Tento dokument detailně popisuje síťovou strukturu, hosting, DNS, git repozitář a nasazovací workflow projektu.

## Hosting a Infrastruktura

Pro testovací i produkční verzi byla zvolena **Možnost A (Netlify / Vercel)** s bezplatným tarifem.

### Testovací verze (Staging)
* **Hosting:** Netlify nebo Vercel (bezplatný plán).
* **Adresa projektu:** Bude vygenerována po prvním nasazení (např. `renata-web.netlify.app` nebo `renata-web.vercel.app`).
* **Nasazování:** Automatické (CI/CD) při každém pushnutí do větve `main` na Git.

### Produkční verze (Production)
* **Doména:** `www.naturelift.help` / `naturelift.help`
* **DNS a Registrátor:** Bude upřesněno klientem. Doména bude nasměrována pomocí CNAME / ALIAS záznamů na hosting Netlify/Vercel.
* **SSL Certifikát:** Let's Encrypt (automaticky spravovaný a obnovovaný hostingovou platformou, HTTPS vynuceno).

---

## Git a verzování

* **Repozitář:** Lokální repozitář v `c:\GitHub\Renata-web\`.
* **GitHub Repozitář:** [ariael/Renata-web](https://github.com/ariael/Renata-web)
* **Větvící model:**
  * `master` (výchozí) - produkční kód, stabilní verze připravená k nasazení.
* **Deployment workflow:**
  1. Lokální úpravy a otestování (`npm run dev`).
  2. Vytvoření buildu (`npm run build`) pro ověření chyb v kompilaci a TypeScriptu.
  3. Commit a Push do vzdáleného repozitáře (`git push origin master`).
  4. Automatický build a deployment na straně hostingu (Netlify / Vercel).

### Postup pro první nasazení (Deployment)
Pro okamžité nasazení a spuštění projektu na internetu stačí kliknout na jeden z následujících odkazů, který automaticky naimportuje a zprovozní web pod vaším účtem:
* **[Nasadit na Vercel (1-Click)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fariael%2FRenata-web)**
* **[Nasadit na Netlify (1-Click)](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2Fariael%2FRenata-web)**
