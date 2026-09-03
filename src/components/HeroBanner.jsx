import React from 'react';
import { Sparkles, Truck, ShieldCheck, MessageCircle, ArrowRight, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export const HeroBanner = () => {
  const { setSelectedCategory } = useProducts();

  return (
    <section className="relative overflow-hidden bg-[#FAF7F5] pt-6 pb-8 sm:pt-8 sm:pb-12 border-b border-[#F0E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FDF6F0] to-[#FAF0EA] border border-[#F0E2DC] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
          
          {/* Subtle Decorative pastel background accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F9EAE8]/60 rounded-full blur-3xl pointer-events-none" />

          {/* Top Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9EAE8] border border-[#F3D5D8] text-[#B85B65] text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D88A92]" />
            <span>Colección & Catálogo Multirrubro</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D2B2E] tracking-tight leading-tight">
                Moda, Fragancias, Juguetes & Accesorios en{' '}
                <span className="text-[#C8747D] italic font-serif">
                  tu tienda preferida
                </span>
              </h1>
              
              <p className="text-[#6E5458] text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                Descubre nuestra variedad seleccionada con envío directo a tu hogar y atención personalizada 1 a 1 por WhatsApp.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D88A92] to-[#C8747D] hover:from-[#C8747D] hover:to-[#B85B65] text-white font-bold text-xs shadow-md shadow-[#D88A92]/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me/5491112345678?text=Hola,%20quisiera%20consultar%20por%20sus%20productos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl bg-[#FFFDF9] hover:bg-[#FDF6F0] border border-[#E8D5CD] text-[#2D6A3B] font-semibold text-xs flex items-center gap-2 transition-all hover:scale-[1.02] shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#2D6A3B]" />
                  <span>Consultar WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Feature Highlights Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              
              <div className="p-4 rounded-2xl bg-white border border-[#F0E2DC] flex items-center gap-3.5 shadow-xs hover:border-[#E8C5C8] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#F9EAE8] border border-[#F3D5D8] flex items-center justify-center text-[#C8747D] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#3D2B2E]">Envíos a Domicilio</h4>
                  <p className="text-[11px] text-[#7A6266]">Entregas rápidas y seguras</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F0E2DC] flex items-center gap-3.5 shadow-xs hover:border-[#E8C5C8] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#EFE7F7] border border-[#D6C4E7] flex items-center justify-center text-[#7C52A5] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#3D2B2E]">Atención Personalizada</h4>
                  <p className="text-[11px] text-[#7A6266]">Trato directo con la dueña</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F0E2DC] flex items-center gap-3.5 shadow-xs hover:border-[#E8C5C8] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0E0] border border-[#FCE0C7] flex items-center justify-center text-[#D97724] shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#3D2B2E]">Calidad Seleccionada</h4>
                  <p className="text-[11px] text-[#7A6266]">Productos 100% garantizados</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
