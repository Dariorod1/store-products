import React, { useState } from 'react';
import { 
  X, 
  ShoppingCart, 
  MessageCircle, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateDiscount, generateWhatsAppUrl } from '../utils/formatters';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.category_slug === 'ropa' ? 'M' : null
  );

  if (!product) return null;

  const discountTag = calculateDiscount(product.price, product.original_price);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      onClose();
    }
  };

  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppUrl([{ ...product, quantity }]);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-3xl bg-[#FFFDF9] border border-[#F0E2DC] rounded-3xl overflow-hidden shadow-2xl text-[#3D2B2E] my-6 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 text-[#7A6266] hover:text-[#3D2B2E] hover:bg-white shadow-xs transition-all border border-[#F0E2DC]"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image View */}
          <div className="relative aspect-square md:aspect-auto bg-[#FAF7F5] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#F0E2DC]">
            <img
              src={product.image_url}
              alt={product.title}
              className="max-h-[380px] w-full object-contain rounded-2xl"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-[#F9EAE8] text-[#B85B65] border border-[#F3D5D8] text-xs font-bold uppercase tracking-wider shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            
            <div className="space-y-3">
              
              {/* Category & Stock */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8747D]">
                  {product.category_name || product.category_slug}
                </span>
                {isOutOfStock ? (
                  <span className="px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Sin Stock
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#EBF5ED] border border-[#C2E0C8] text-[#2D6A3B] text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> En Stock ({product.stock} un.)
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3D2B2E] leading-tight">
                {product.title}
              </h2>

              {/* Prices */}
              <div className="flex items-baseline gap-3 py-2 border-y border-[#F0E2DC]">
                <span className="text-2xl font-extrabold text-[#C8747D] font-mono">
                  {formatPrice(product.price * quantity)}
                </span>
                {product.original_price > product.price && (
                  <span className="text-xs text-[#9E8286] line-through font-mono">
                    {formatPrice(product.original_price * quantity)}
                  </span>
                )}
                {discountTag && (
                  <span className="px-2 py-0.5 rounded-md bg-[#C8747D] text-white text-xs font-bold">
                    {discountTag}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#6E5458] leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">
                {product.description || 'Producto exclusivo en catálogo boutique con garantía directa de la dueña.'}
              </p>

              {/* Size Selector for clothing */}
              {product.category_slug === 'ropa' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#8C7276] uppercase tracking-wider block">
                    Talle:
                  </label>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant(size)}
                        className={`w-9 h-9 rounded-xl font-bold text-xs border transition-all ${
                          selectedVariant === size
                            ? 'bg-[#C8747D] border-[#C8747D] text-white shadow-xs'
                            : 'bg-white border-[#F0E2DC] text-[#4A3538] hover:border-[#C8747D]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#8C7276] uppercase tracking-wider block">
                  Cantidad:
                </label>
                <div className="inline-flex items-center bg-white border border-[#F0E2DC] rounded-xl p-0.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-lg text-[#7A6266] hover:bg-[#FAF0EA]"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-mono font-bold text-xs text-[#3D2B2E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    className="p-1.5 rounded-lg text-[#7A6266] hover:bg-[#FAF0EA]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 border-t border-[#F0E2DC]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleWhatsAppOrder}
                  className="py-3 px-4 rounded-2xl bg-[#EBF5ED] hover:bg-[#DDF0E0] border border-[#C2E0C8] text-[#2D6A3B] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#2D6A3B]" />
                  <span>Pedir por WhatsApp</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] hover:from-[#C8747D] hover:to-[#B85B65] text-white shadow-xs'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
