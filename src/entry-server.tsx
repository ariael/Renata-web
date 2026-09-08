import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * Vykreslí aplikaci do HTML řetězce při buildu.
 *
 * Data z CMS se importují staticky (viz cmsClient), takže tenhle render
 * vyrobí přesně tentýž obsah, jaký potom sestaví prohlížeč – hydratace tak
 * nemá co dohánět a roboti dostanou skutečný text místo prázdného <div>.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
