import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'VITE_',
  server: {
    port: 3000,
    open: false,
    host: true,
    watch: {
      ignored: ['**/dist/**', '**/.git/**', '**/scratch/**']
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
