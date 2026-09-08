import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seoFromCms } from './vite-plugin-seo'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), seoFromCms()],
  define: {
    // Rok pro patičku. Kdyby se počítal až za běhu, lišil by se předrenderovaný
    // výstup od toho, co vykreslí prohlížeč, a hydratace by na to nadávala.
    __BUILD_YEAR__: new Date().getFullYear(),
  },
  build: {
    // Build výstup má hash v názvu a jde cachovat natrvalo; drží se proto
    // stranou od /assets/, kam Decap CMS ukládá obrázky s pevným názvem.
    // Cachovací pravidla jsou v netlify.toml.
    assetsDir: 'build',
    // SSR build má jediný vstup (entry-server), který si předává Vite z CLI.
    ...(isSsrBuild
      ? {}
      : {
          rollupOptions: {
            input: {
              // Web samotný
              main: resolve(__dirname, 'index.html'),
              // Interní generátor poukazů – samostatná stránka, web na ni neodkazuje
              poukazy: resolve(__dirname, 'interni/poukazy/index.html'),
            },
          },
        }),
  },
}))
