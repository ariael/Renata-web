import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import Root from './Root'

// Stránka přichází ze serveru už vykreslená (viz prerender.mjs), takže se
// k ní jen připojíme. createRoot by hotové HTML zahodil a překreslil.
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <Root path={window.location.pathname} />
  </StrictMode>,
)
