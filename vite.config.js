import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      port: 3000,
      open: true
    },
    // Exponer variables sin prefijo VITE_ para que funcionen directo en Vercel
    envPrefix: ['VITE_', 'SUPABASE_', 'WHATSAPP_', 'STORE_', 'MP_'],
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(
        env.SUPABASE_URL || process.env.SUPABASE_URL || env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
      ),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(
        env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
      ),
      'import.meta.env.WHATSAPP_NUMBER': JSON.stringify(
        env.WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || env.VITE_WHATSAPP_NUMBER || process.env.VITE_WHATSAPP_NUMBER
      ),
      'import.meta.env.STORE_NAME': JSON.stringify(
        env.STORE_NAME || process.env.STORE_NAME || env.VITE_STORE_NAME || process.env.VITE_STORE_NAME || 'Tienda Rooh'
      ),
      'import.meta.env.MP_PUBLIC_KEY': JSON.stringify(
        env.MP_PUBLIC_KEY || process.env.MP_PUBLIC_KEY || env.VITE_MP_PUBLIC_KEY || process.env.VITE_MP_PUBLIC_KEY
      ),
      'import.meta.env.MP_ACCESS_TOKEN': JSON.stringify(
        env.MP_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || env.VITE_MP_ACCESS_TOKEN || process.env.VITE_MP_ACCESS_TOKEN
      ),
      // Retrocompatibilidad con VITE_
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        env.SUPABASE_URL || process.env.SUPABASE_URL || env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
      ),
      'import.meta.env.VITE_WHATSAPP_NUMBER': JSON.stringify(
        env.WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || env.VITE_WHATSAPP_NUMBER || process.env.VITE_WHATSAPP_NUMBER
      ),
      'import.meta.env.VITE_STORE_NAME': JSON.stringify(
        env.STORE_NAME || process.env.STORE_NAME || env.VITE_STORE_NAME || process.env.VITE_STORE_NAME || 'Tienda Rooh'
      )
    }
  };
});
