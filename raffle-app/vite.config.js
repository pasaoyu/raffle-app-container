import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/raffle-app-container/',  // GitHubリポジトリ名
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})
