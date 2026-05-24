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
* **Větvící model:**
  * `main` - produkční kód, stabilní verze připravená k nasazení.
  * Vývojové větve (pokud je potřeba) se větví z `main`.
* **Deployment workflow:**
  1. Lokální úpravy a otestování (`npm run dev`).
  2. Vytvoření buildu (`npm run build`) pro ověření chyb v kompilaci a TypeScriptu.
  3. Commit a Push do vzdáleného repozitáře (bude nastaven GitHub/GitLab dle přání uživatele).
  4. Automatický build a deployment na straně hostingu.
