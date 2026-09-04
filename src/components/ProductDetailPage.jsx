import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ShieldCheck, 
  Star, 
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  RotateCcw,
  Loader2,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { formatPrice, calculateDiscount, generateWhatsAppUrl } from '../utils/formatters';
import { createMercadoPagoCheckout } from '../services/mercadopago';
import { ProductCard } from './ProductCard';

export const ProductDetailPage = ({ product, onBack, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.category_slug === 'ropa' ? 'M' : null
  );
  const [isSubmittingMp, setIsSubmittingMp] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mpError, setMpError] = useState(null);

  if (!product) return null;

  const discountTag = calculateDiscount(product.price, product.original_price);
  const isOutOfStock = product.stock <= 0;

  // Filtrar productos relacionados de la misma categoría o tienda
  const relatedProducts = (products || [])
    .filter((p) => p.id !== product.id && (p.category_slug === product.category_slug || !product.category_slug))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppUrl([{ ...product, quantity }]);
    window.open(url, '_blank');
  };

  const handleMercadoPagoOrder = async () => {
    setIsSubmittingMp(true);
    setMpError(null);
    try {
      const initPoint = await createMercadoPagoCheckout(
        [{ ...product, quantity }],
        { name: 'Cliente Web', notes: `Compra directa: ${product.title}` }
      );
      window.location.href = initPoint;
    } catch (err) {
      console.error('Error initiating Mercado Pago:', err);
      setMpError(err.message || 'No se pudo generar el pago. Intenta por WhatsApp.');
      setIsSubmittingMp(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#3D2B2E] pb-16 animate-fadeIn">
      
      {/* Breadcrumb & Navigation Header */}
      <div className="bg-[#FFFDF9] border-b border-[#F0E2DC] sticky top-[72px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF0EA] hover:bg-[#F3E2DA] text-[#7A6266] hover:text-[#3D2B2E] text-xs font-bold transition-all border border-[#E8D5CD] shadow-xs group"
          >
            <ArrowLeft className="w-4 h-4 text-[#C8747D] group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver al catálogo</span>
          </button>

          {/* Breadcrumb path */}
          <nav className="text-xs text-[#8C7276] hidden sm:flex items-center gap-2 font-medium">
            <span>Catálogo</span>
            <span>/</span>
            <span className="capitalize">{product.category_name || product.category_slug || 'General'}</span>
            <span>/</span>
            <span className="text-[#3D2B2E] font-semibold truncate max-w-xs">{product.title}</span>
          </nav>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#F0E2DC] text-[#7A6266] hover:text-[#3D2B2E] text-xs font-semibold shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C8747D]" />
            <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Gallery & Highlights (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Image Viewer */}
            <div className="relative bg-[#FFFDF9] border border-[#F0E2DC] rounded-3xl p-6 sm:p-10 shadow-sm flex items-center justify-center min-h-[350px] sm:min-h-[460px] overflow-hidden group">
              <img
                src={product.image_url}
                alt={product.title}
                className="max-h-[380px] sm:max-h-[440px] w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              
              {product.badge && (
                <span className="absolute top-5 left-5 px-3.5 py-1.5 rounded-2xl bg-[#F9EAE8] text-[#B85B65] border border-[#F3D5D8] text-xs font-bold uppercase tracking-wider shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Description Section */}
            <div className="bg-[#FFFDF9] border border-[#F0E2DC] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#3D2B2E] border-b border-[#F0E2DC] pb-3">
                Descripción del Producto
              </h3>
              <p className="text-xs sm:text-sm text-[#6E5458] leading-relaxed whitespace-pre-line">
                {product.description || 'Producto exclusivo en catálogo boutique con garantía directa de la tienda. Elaborado con materiales de alta calidad y diseño cuidado en cada detalle.'}
              </p>

              {/* Service guarantee pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F0E2DC]">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F5] border border-[#F0E2DC] text-xs text-[#6E5458]">
                  <Truck className="w-4 h-4 text-[#C8747D] shrink-0" />
                  <div>
                    <strong className="block text-[#3D2B2E]">Envío Rápido</strong>
                    <span>A todo el país</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F5] border border-[#F0E2DC] text-xs text-[#6E5458]">
                  <ShieldCheck className="w-4 h-4 text-[#C8747D] shrink-0" />
                  <div>
                    <strong className="block text-[#3D2B2E]">Compra Protegida</strong>
                    <span>Garantía de tienda</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FAF7F5] border border-[#F0E2DC] text-xs text-[#6E5458]">
                  <RotateCcw className="w-4 h-4 text-[#C8747D] shrink-0" />
                  <div>
                    <strong className="block text-[#3D2B2E]">Cambio Fácil</strong>
                    <span>Directo en boutique</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Mercado Libre Style Buy Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFDF9] border border-[#F0E2DC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md sticky top-36">
              
              {/* Category & Stock Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8747D]">
                  {product.category_name || product.category_slug || 'Destacado'}
                </span>
                {isOutOfStock ? (
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Sin Stock
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-[#EBF5ED] border border-[#C2E0C8] text-[#2D6A3B] text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> En Stock ({product.stock} disponibles)
                  </span>
                )}
              </div>

              {/* Title & Star Rating */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D2B2E] leading-tight">
                  {product.title}
                </h1>
                
                <div className="flex items-center gap-2 text-xs text-[#8C7276]">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span>(4.9 en reseñas)</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <PackageCheck className="w-3.5 h-3.5" /> Producto Recomendado
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-[#FAF0EA] border border-[#F0E2DC] space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#C8747D] font-mono">
                    {formatPrice(product.price * quantity)}
                  </span>
                  {product.original_price > product.price && (
                    <span className="text-sm text-[#9E8286] line-through font-mono">
                      {formatPrice(product.original_price * quantity)}
                    </span>
                  )}
                  {discountTag && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#C8747D] text-white text-xs font-bold">
                      {discountTag}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#7A6266] font-medium">
                  💳 Pagá en <strong className="text-[#3D2B2E]">3 cuotas sin interés</strong> de {formatPrice((product.price * quantity) / 3)}
                </p>
              </div>

              {/* Clothing Variant Selector */}
              {product.category_slug === 'ropa' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#8C7276] uppercase tracking-wider block">
                    Seleccionar Talle:
                  </label>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant(size)}
                        className={`w-10 h-10 rounded-2xl font-bold text-xs border transition-all ${
                          selectedVariant === size
                            ? 'bg-[#C8747D] border-[#C8747D] text-white shadow-xs scale-105'
                            : 'bg-white border-[#F0E2DC] text-[#4A3538] hover:border-[#C8747D]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8C7276] uppercase tracking-wider block">
                  Cantidad:
                </label>
                <div className="inline-flex items-center bg-white border border-[#F0E2DC] rounded-2xl p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 rounded-xl text-[#7A6266] hover:bg-[#FAF0EA] disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-mono font-bold text-sm text-[#3D2B2E]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    className="p-2 rounded-xl text-[#7A6266] hover:bg-[#FAF0EA]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {mpError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {mpError}
                </div>
              )}

              {/* BUY & CHECKOUT BUTTONS */}
              <div className="space-y-2.5 pt-2">
                
                {/* Mercado Pago Checkout */}
                <button
                  onClick={handleMercadoPagoOrder}
                  disabled={isSubmittingMp || isOutOfStock}
                  className="w-full py-4 px-5 rounded-2xl bg-[#009EE3] hover:bg-[#0082C5] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all group disabled:opacity-50"
                >
                  {isSubmittingMp ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Conectando con Mercado Pago...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                      <span>Comprar Ahora con Mercado Pago</span>
                    </>
                  )}
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                      : 'bg-[#C8747D] hover:bg-[#B85B65] text-white border-[#C8747D] shadow-xs hover:scale-[1.01]'
                  }`}
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  <span>Agregar al Carrito</span>
                </button>

                {/* WhatsApp Direct Buy */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#EBF5ED] hover:bg-[#DDF0E0] border border-[#C2E0C8] text-[#2D6A3B] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <MessageCircle className="w-4.5 h-4.5 text-[#2D6A3B]" />
                  <span>Consultar / Pedir por WhatsApp</span>
                </button>

              </div>

              {/* Safety Footer info */}
              <div className="pt-4 border-t border-[#F0E2DC] text-[11px] text-[#7A6266] space-y-1.5">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C8747D] shrink-0" />
                  <span>Vendedor verificado con atención personalizada.</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#C8747D] shrink-0" />
                  <span>Coordinación inmediata de envíos tras el pago.</span>
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#F0E2DC] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3D2B2E]">
                  Productos Relacionados
                </h3>
                <p className="text-xs text-[#7A6266] mt-0.5">
                  Otros productos que también te pueden interesar
                </p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-bold text-[#C8747D] hover:underline"
              >
                Ver todo el catálogo →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  onSelectProduct={(p) => {
                    onSelectProduct(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
