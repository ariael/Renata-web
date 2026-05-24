import type { Service, HomepageSettings } from './fallbackData'
import { 
  SERVICES_FALLBACK_DATA, 
  HOMEPAGE_SETTINGS_FALLBACK 
} from './fallbackData'

// Direct ES imports for settings
import settingsJson from './data/settings.json'

// Vite glob imports for dynamic discovery of services files
const serviceModules = import.meta.glob('./data/services/*.json', { eager: true })

/**
 * Resolves a service image. 
 * If it's a relative/absolute path from Decap CMS (e.g. /assets/image.png), it returns it directly.
 * Otherwise, falls back to the local imported fallback image.
 */
export function getServiceImageUrl(serviceId: string, imageVal: string): string {
  if (!imageVal) {
    const fallback = SERVICES_FALLBACK_DATA.find(s => s.id === serviceId)
    return fallback ? fallback.image : ''
  }

  // Paths starting with '/' (e.g. /assets/buccal_massage.png) are served directly from the public directory in Vite
  if (imageVal.startsWith('/') || imageVal.startsWith('http://') || imageVal.startsWith('https://') || imageVal.startsWith('data:')) {
    return imageVal
  }

  // Fallback to local image based on serviceId
  const fallback = SERVICES_FALLBACK_DATA.find(s => s.id === serviceId)
  return fallback ? fallback.image : imageVal
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const servicesList: Service[] = []
    
    for (const path in serviceModules) {
      const module: any = serviceModules[path]
      const serviceData = module.default || module
      
      if (serviceData && typeof serviceData === 'object' && serviceData.id) {
        servicesList.push({
          id: serviceData.id,
          title: serviceData.title,
          tagline: serviceData.tagline,
          duration: serviceData.duration,
          price: serviceData.price,
          image: getServiceImageUrl(serviceData.id, serviceData.image),
          shortDesc: serviceData.shortDesc || serviceData.short_desc,
          longDesc: serviceData.longDesc || serviceData.long_desc,
          benefits: Array.isArray(serviceData.benefits) ? serviceData.benefits : [],
          contraindications: serviceData.contraindications,
          sortOrder: typeof serviceData.sortOrder === 'number' ? serviceData.sortOrder : (serviceData.sort_order || 99)
        })
      }
    }

    if (servicesList.length === 0) {
      console.log('No service JSON files found. Using fallback services.')
      return SERVICES_FALLBACK_DATA
    }

    // Sort by sortOrder
    return servicesList.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99))
  } catch (error) {
    console.warn('Failed to parse service JSON files, using fallback data:', error)
    return SERVICES_FALLBACK_DATA
  }
}

export async function fetchHomepageSettings(): Promise<HomepageSettings> {
  try {
    const item: any = settingsJson

    if (!item) {
      return HOMEPAGE_SETTINGS_FALLBACK
    }

    return {
      heroTagline: item.heroTagline || item.hero_tagline || HOMEPAGE_SETTINGS_FALLBACK.heroTagline,
      heroTitle: item.heroTitle || item.hero_title || HOMEPAGE_SETTINGS_FALLBACK.heroTitle,
      heroDescription: item.heroDescription || item.hero_description || HOMEPAGE_SETTINGS_FALLBACK.heroDescription,
      
      aboutTitle: item.aboutTitle || item.about_title || HOMEPAGE_SETTINGS_FALLBACK.aboutTitle,
      aboutText1: item.aboutText1 || item.about_text1 || HOMEPAGE_SETTINGS_FALLBACK.aboutText1,
      aboutText2: item.aboutText2 || item.about_text2 || HOMEPAGE_SETTINGS_FALLBACK.aboutText2,
      aboutQuote: item.aboutQuote || item.about_quote || HOMEPAGE_SETTINGS_FALLBACK.aboutQuote,
      aboutText3: item.aboutText3 || item.about_text3 || HOMEPAGE_SETTINGS_FALLBACK.aboutText3,
      
      whyTitle: item.whyTitle || item.why_title || HOMEPAGE_SETTINGS_FALLBACK.whyTitle,
      whyDescription1: item.whyDescription1 || item.why_description1 || HOMEPAGE_SETTINGS_FALLBACK.whyDescription1,
      whyDescription2: item.whyDescription2 || item.why_description2 || HOMEPAGE_SETTINGS_FALLBACK.whyDescription2,
      whyDescription3: item.whyDescription3 || item.why_description3 || HOMEPAGE_SETTINGS_FALLBACK.whyDescription3,
      
      card1Title: item.card1Title || item.card1_title || HOMEPAGE_SETTINGS_FALLBACK.card1Title,
      card1Desc: item.card1Desc || item.card1_desc || HOMEPAGE_SETTINGS_FALLBACK.card1Desc,
      card2Title: item.card2Title || item.card2_title || HOMEPAGE_SETTINGS_FALLBACK.card2Title,
      card2Desc: item.card2Desc || item.card2_desc || HOMEPAGE_SETTINGS_FALLBACK.card2Desc,
      card3Title: item.card3Title || item.card3_title || HOMEPAGE_SETTINGS_FALLBACK.card3Title,
      card3Desc: item.card3Desc || item.card3_desc || HOMEPAGE_SETTINGS_FALLBACK.card3Desc,
      card4Title: item.card4Title || item.card4_title || HOMEPAGE_SETTINGS_FALLBACK.card4Title,
      card4Desc: item.card4Desc || item.card4_desc || HOMEPAGE_SETTINGS_FALLBACK.card4Desc,
      
      pricingTitle: item.pricingTitle || item.pricing_title || HOMEPAGE_SETTINGS_FALLBACK.pricingTitle,
      pricingDesc: item.pricingDesc || item.pricing_desc || HOMEPAGE_SETTINGS_FALLBACK.pricingDesc,
      
      contactTitle: item.contactTitle || item.contact_title || HOMEPAGE_SETTINGS_FALLBACK.contactTitle,
      contactDesc: item.contactDesc || item.contact_desc || HOMEPAGE_SETTINGS_FALLBACK.contactDesc,
      contactName: item.contactName || item.contact_name || HOMEPAGE_SETTINGS_FALLBACK.contactName,
      contactAddress: item.contactAddress || item.contact_address || HOMEPAGE_SETTINGS_FALLBACK.contactAddress,
      contactPhone: item.contactPhone || item.contact_phone || HOMEPAGE_SETTINGS_FALLBACK.contactPhone,
      contactEmail: item.contactEmail || item.contact_email || HOMEPAGE_SETTINGS_FALLBACK.contactEmail,
    }
  } catch (error) {
    console.warn('Failed to parse settings JSON, using fallback data:', error)
    return HOMEPAGE_SETTINGS_FALLBACK
  }
}
