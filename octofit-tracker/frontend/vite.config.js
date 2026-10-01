import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __CODESPACE_NAME__: JSON.stringify(process.env.CODESPACE_NAME ?? ''),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.app.github.dev'],
  },
})
