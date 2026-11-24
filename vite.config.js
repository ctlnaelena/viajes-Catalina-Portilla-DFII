import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' -> el build funciona en cualquier subruta de GitHub Pages
// (https://usuario.github.io/nombre-repo/) sin depender del nombre del repo.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Separa librerías en archivos propios para un mejor cacheo.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mock: ['msw', 'msw/browser', 'graphql'],
        },
      },
    },
  },
})
