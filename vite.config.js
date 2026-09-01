import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this at /<repo>/, not at the domain root, so assets
  // need the repo name in their paths. Change this if the repo is renamed.
  base: '/todolist-shopback-test/',
})
