import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      // Set up aliases for absolute imports
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@models': path.resolve(__dirname, './src/models'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  build: {
    outDir: 'dist'
  }
})