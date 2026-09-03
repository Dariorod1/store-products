// Nombre y configuración de la tienda — se lee de las variables de entorno
// En Vercel: agregar STORE_NAME sin prefijo VITE_ (no tiene problema de bloqueo)
// En local: agregar STORE_NAME en el .env

export const STORE_NAME = import.meta.env.VITE_STORE_NAME || 'Mi Tienda';
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493863434888';
