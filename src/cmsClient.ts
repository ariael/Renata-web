import type { Service, HomepageSettings } from './fallbackData'
import { 
  SERVICES_FALLBACK_DATA, 
  HOMEPAGE_SETTINGS_FALLBACK 
} from './fallbackData'

// Direct ES imports for settings
import settingsJson from './data/settings.json'

/** Tvar JSON souboru ze složky data/ – z CMS můžou přijít obě konvence názvů. */
type RawRecord = Record<string, unknown>

// Vite glob imports for dynamic discovery of services files
const serviceModules = import.meta.glob<{ default?: RawRecord }>('./data/services/*.json', { eager: true })

/** Vrátí první vyplněný textový údaj – zkouší camelCase i snake_case název. */
function text(item: RawRecord, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = item[key]
    if (typeof value === 'string' && value !== '') return value
  }
  return undefined
}

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
      const module = serviceModules[path]
      const serviceData = (module.default ?? module) as RawRecord
      const id = text(serviceData, 'id')

      if (id) {
        const sortOrder = serviceData.sortOrder ?? serviceData.sort_order
        servicesList.push({
          id,
          title: text(serviceData, 'title') ?? '',
          tagline: text(serviceData, 'tagline') ?? '',
          duration: text(serviceData, 'duration') ?? '',
          price: text(serviceData, 'price') ?? '',
          image: getServiceImageUrl(id, text(serviceData, 'image') ?? ''),
          shortDesc: text(serviceData, 'shortDesc', 'short_desc') ?? '',
          longDesc: text(serviceData, 'longDesc', 'long_desc') ?? '',
          benefits: Array.isArray(serviceData.benefits)
            ? serviceData.benefits.filter((b): b is string => typeof b === 'string')
            : [],
          contraindications: text(serviceData, 'contraindications') ?? '',
          sortOrder: typeof sortOrder === 'number' ? sortOrder : 99
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
    const item = settingsJson as RawRecord

    if (!item) {
      return HOMEPAGE_SETTINGS_FALLBACK
    }

    // Pro každý údaj zkusíme camelCase i snake_case název; co chybí, doplní fallback.
    const settings = { ...HOMEPAGE_SETTINGS_FALLBACK }
    for (const key of Object.keys(settings) as (keyof HomepageSettings)[]) {
      const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
      settings[key] = text(item, key, snakeKey) ?? HOMEPAGE_SETTINGS_FALLBACK[key]
    }
    return settings
  } catch (error) {
    console.warn('Failed to parse settings JSON, using fallback data:', error)
    return HOMEPAGE_SETTINGS_FALLBACK
  }
}
