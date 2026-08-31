import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative paths so the build works under any GitHub Pages subpath.
  base: './',
  server: {
    port: 3000,
  },
})
