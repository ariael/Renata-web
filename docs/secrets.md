# Secrets & Citlivé konfigurace - Renata-web

Tento soubor je lokální a je **ignorován v Gitu** (`.gitignore`), aby se zabránilo úniku hesel a klíčů.

## Konfigurace prostředí (.env.local)

Při spuštění projektu lokálně nebo na hostingu použijte následující proměnné:

```env
# EmailJS / Formspree / jiná služba pro odesílání formulářů
VITE_CONTACT_FORM_API_KEY=your_api_key_here
VITE_CONTACT_FORM_SERVICE_ID=service_xxxxx
VITE_CONTACT_FORM_TEMPLATE_ID=template_xxxxx

# Google Maps API klíč (pokud by byla použita plná verze mapy)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Přihlašovací údaje k hostingu

* **Poskytovatel:** Netlify / Vercel
* **Účet:** Přihlášení přes GitHub (renata-web repozitář)
