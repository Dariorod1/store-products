import React from 'react';
import { 
  ShoppingCart, 
  MessageCircle, 
  Eye, 
  Star, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateDiscount, generateWhatsAppUrl } from '../utils/formatters';

export const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const discountTag = calculateDiscount(product.price, product.original_price);
  const isOutOfStock = product.stock <= 0;

  const handleWhatsAppQuickOrder = (e) => {
    e.stopPropagation();
    const url = generateWhatsAppUrl([{ ...product, quantity: 1 }]);
    window.open(url, '_blank');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white border border-[#F0E2DC] hover:border-[#E8C5C8] rounded-2xl overflow-hidden soft-shadow soft-shadow-hover flex flex-col justify-between cursor-pointer transition-all duration-300"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F5]">
        
        {/* Product Image */}
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Top Left & Right */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-md bg-[#F9EAE8] text-[#B85B65] border border-[#F3D5D8] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs">
              {product.badge}
            </span>
          )}
          {discountTag && (
            <span className="px-2 py-0.5 rounded-md bg-[#C8747D] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs">
              {discountTag}
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-md bg-white/90 border border-red-200 text-red-600 text-[9px] font-bold flex items-center gap-1 shadow-xs">
              <XCircle className="w-2.5 h-2.5 text-red-500" /> Agotado
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-white/90 border border-emerald-200 text-emerald-700 text-[9px] font-bold flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Stock
            </span>
          )}
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
          <span className="px-3 py-1.5 rounded-xl bg-white/90 text-[#3D2B2E] text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5 text-[#C8747D]" /> Ver detalle
          </span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] text-[#8C7276] mb-1">
            <span className="font-semibold text-[#C8747D] uppercase tracking-wider truncate max-w-[100px]">
              {product.category_name || product.category_slug}
            </span>
            {product.rating && (
              <span className="flex items-center gap-0.5 text-[#D97724] font-bold text-[10px]">
                <Star className="w-2.5 h-2.5 fill-[#E5A93C] text-[#E5A93C]" />
                {product.rating}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-xs sm:text-sm text-[#3D2B2E] group-hover:text-[#C8747D] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </div>

        {/* Prices & Actions */}
        <div className="pt-2 border-t border-[#F5ECE8] flex flex-col gap-2">
          
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-[#C8747D] font-mono tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.original_price > product.price && (
              <span className="text-[10px] sm:text-xs text-[#9E8286] line-through font-mono">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            
            {/* WhatsApp Direct Order */}
            <button
              onClick={handleWhatsAppQuickOrder}
              className="py-1.5 px-2 rounded-xl bg-[#EBF5ED] hover:bg-[#DDF0E0] border border-[#C2E0C8] text-[#2D6A3B] text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              title="Pedir por WhatsApp"
            >
              <MessageCircle className="w-3 h-3 text-[#2D6A3B] shrink-0" />
              <span className="truncate">Pedir</span>
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] hover:from-[#C8747D] hover:to-[#B85B65] text-white shadow-xs'
              }`}
              title={isOutOfStock ? 'Sin stock' : 'Agregar al Carrito'}
            >
              <ShoppingCart className="w-3 h-3 shrink-0" />
              <span className="truncate">Agregar</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
