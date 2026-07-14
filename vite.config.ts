import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubPages = process.env.GH_PAGES === 'true'

export default defineConfig({
  base: isGitHubPages ? '/onestory-admin/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
})
