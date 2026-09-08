import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import Root, { NOT_FOUND_PATH } from './Root'

export { allRoutes } from './routes'
export { NOT_FOUND_PATH }
export { buildJsonLd } from './seo'

/**
 * Vykreslí stránku dané adresy do HTML řetězce při buildu.
 *
 * Data z CMS se importují staticky (viz cmsClient), takže tenhle render
 * vyrobí přesně tentýž obsah, jaký potom sestaví prohlížeč – hydratace tak
 * nemá co dohánět a roboti dostanou skutečný text místo prázdného <div>.
 */
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <Root path={path} />
    </StrictMode>
  )
}
