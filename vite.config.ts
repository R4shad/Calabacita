import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works on any static host,
  // including sub-paths like GitHub Pages (/calabacita/).
  base: './',
  plugins: [react(), tailwindcss()],
})