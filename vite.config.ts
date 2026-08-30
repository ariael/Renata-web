import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Build výstup má hash v názvu a jde cachovat natrvalo; drží se proto
    // stranou od /assets/, kam Decap CMS ukládá obrázky s pevným názvem.
    // Cachovací pravidla jsou v netlify.toml.
    assetsDir: 'build',
  },
})
