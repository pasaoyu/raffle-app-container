import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/raffle-app-container/',  // GitHubリポジトリ名
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})
