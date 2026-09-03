import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: true
  },
  // Permite usar variables SIN prefijo VITE_ en Vercel (evita el bloqueo de variables públicas)
  // Las variables con prefijo VITE_ del .env local siguen funcionando normalmente
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    ),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
      process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
    ),
    'import.meta.env.VITE_WHATSAPP_NUMBER': JSON.stringify(
      process.env.WHATSAPP_NUMBER || process.env.VITE_WHATSAPP_NUMBER
    ),
    'import.meta.env.VITE_STORE_NAME': JSON.stringify(
      process.env.STORE_NAME || process.env.VITE_STORE_NAME || 'Mi Tienda'
    ),
  }
});
