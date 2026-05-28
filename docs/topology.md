# Topologie a nasazení - Renata-web

Tento dokument detailně popisuje síťovou strukturu, hosting, DNS, git repozitář a nasazovací workflow projektu.

## Hosting a Infrastruktura

Pro testovací i produkční verzi byla zvolena **Možnost A (Netlify / Vercel)** s bezplatným tarifem.

### Testovací verze (Staging)
* **Hosting:** Netlify (bezplatný plán).
* **Adresa projektu:** [magical-tiramisu-b97682.netlify.app](https://magical-tiramisu-b97682.netlify.app/)
* **Nasazování:** Automatické (CI/CD) při každém pushnutí do větve `master` na Git.

### Produkční verze (Production)
* **Doména:** [naturelift.help](https://naturelift.help) / [www.naturelift.help](https://www.naturelift.help) (Plně aktivní a nasměrovaná)
* **DNS a Registrátor:** Porkbun (porkbun.com). Nasměrováno pomocí ALIAS a CNAME na Netlify (`magical-tiramisu-b97682.netlify.app`).
* **SSL Certifikát:** Let's Encrypt (aktivní, automaticky spravovaný a obnovovaný Netlify, HTTPS vynuceno).

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
  4. Automatický build a deployment na straně Netlify.

### Postup pro nasazení a propojení domény
1. V administraci Netlify přejděte na **Site configuration** -> **Domain management** -> **Add custom domain**.
2. Přidejte `naturelift.help`.
3. V administraci Porkbun upravte DNS záznamy:
   - Změňte **ALIAS** záznam pro `naturelift.help` z `pixie.porkbun.com` na `magical-tiramisu-b97682.netlify.app`.
   - Změňte/přidejte **CNAME** záznam pro `www.naturelift.help` (nebo divokou kartu `*`) na `magical-tiramisu-b97682.netlify.app`.
   - Případně lze přejít na Netlify DNS (přepsáním NS záznamů v Porkbunu podle pokynů Netlify).

