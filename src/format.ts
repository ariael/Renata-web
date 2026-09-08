import type { VoucherPackage } from './fallbackData'

/** 4750 → „4 750 Kč"; tisíce odděluje nezlomitelnou mezerou, aby se cena nezlomila. */
export function formatCzk(value: number): string {
  return `${value.toLocaleString('cs-CZ').replace(/\s/g, '\u00A0')} Kč`
}

/** „2026-12-31" → „31. 12. 2026"; neplatný vstup vrátí prázdný text. */
export function czDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!match) return ''
  const [, year, month, day] = match
  return `${Number(day)}. ${Number(month)}. ${year}`
}

/** Hodnota poukazu ve výběru služeb v rezervačním formuláři. */
export function voucherServiceId(pkg: VoucherPackage): string {
  return `poukaz-${pkg.count}`
}
