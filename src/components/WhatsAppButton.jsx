import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const number = (import.meta.env.VITE_WHATSAPP_NUMBER || '5491112345678').replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${number}?text=Hola!%20Tengo%20una%20consulta%20sobre%20sus%20productos.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center group hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce"
      title="¿Consultas? Háblanos por WhatsApp"
      aria-label="Atención por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all duration-300">
        ¿Consultas? Escríbenos
      </span>
    </a>
  );
};
