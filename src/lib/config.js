// Nombre y configuración de la tienda — se lee de las variables de entorno sin necesidad de prefijo VITE_
const rawStoreName = (import.meta.env.STORE_NAME || import.meta.env.VITE_STORE_NAME || 'Tienda Rooh').replace(/^"|"$/g, '');

// Si la variable contiene un guion (ej: "Tienda Rooh - Tienda Multirrubro"),
// separamos el nombre principal de la bajada/subtítulo para que la cabecera quede impecable.
export const STORE_FULL_NAME = rawStoreName;
export const STORE_NAME = rawStoreName.split('-')[0].trim() || 'Tienda Rooh';
export const STORE_SUBTITLE = rawStoreName.includes('-') 
  ? rawStoreName.split('-').slice(1).join('-').trim() 
  : 'Tienda Multirrubro';

export const WHATSAPP_NUMBER = import.meta.env.WHATSAPP_NUMBER || import.meta.env.VITE_WHATSAPP_NUMBER || '5493863434888';

