import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El backend solo acepta peticiones (CORS) desde http://localhost:5173,
// por eso se fija el puerto y no se permite que Vite use otro.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
})
