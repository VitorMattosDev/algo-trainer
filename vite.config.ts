import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' é obrigatório para o deploy no GitHub Pages — não alterar.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // O chunk do compilador TypeScript (~3,6 MB) é lazy por design:
    // só é baixado na primeira execução de código TS do usuário.
    chunkSizeWarningLimit: 3700,
  },
});
