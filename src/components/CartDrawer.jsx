import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageCircle, 
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { formatPrice, generateWhatsAppUrl } from '../utils/formatters';
import { supabase } from '../lib/supabase';
import { createMercadoPagoCheckout } from '../services/mercadopago';
import { useBackHandler } from '../hooks/useBackHandler';

export const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal 
  } = useCart();

  useBackHandler(isCartOpen, () => setIsCartOpen(false));

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingMp, setIsSubmittingMp] = useState(false);
  const [mpError, setMpError] = useState(null);

  if (!isCartOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect unavailable');
    }
  };

  const handleCheckoutWhatsApp = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    triggerConfetti();

    try {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerInfo.name || 'Cliente de WhatsApp',
            customer_phone: customerInfo.phone || 'N/A',
            customer_address: customerInfo.address || 'A convenir',
            notes: customerInfo.notes || '',
            total_amount: cartTotal,
            status: 'pending'
          }
        ])
        .select();

      if (!orderErr && orderData && orderData.length > 0) {
        const orderId = orderData[0].id;
        const itemsToInsert = cartItems.map((item) => ({
          order_id: orderId,
          product_id: item.id.toString().startsWith('prod-') ? null : item.id,
          product_title: item.title,
          unit_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }));

        await supabase.from('order_items').insert(itemsToInsert);
      }
    } catch (err) {
      console.log('Guardando orden local para WhatsApp:', err);
    }

    const whatsappUrl = generateWhatsAppUrl(cartItems, customerInfo);
    window.open(whatsappUrl, '_blank');
    setIsSubmitting(false);
  };

  const handleCheckoutMercadoPago = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmittingMp(true);
    setMpError(null);
    triggerConfetti();

    try {
      const initPoint = await createMercadoPagoCheckout(cartItems, customerInfo);
      window.location.href = initPoint;
    } catch (err) {
      console.error('Error initiating Mercado Pago:', err);
      setMpError(err.message || 'No se pudo iniciar el pago. Intenta por WhatsApp.');
      setIsSubmittingMp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Drawer Panel */}
      <aside className="absolute inset-y-0 right-0 max-w-md w-full bg-[#FFFDF9] border-l border-[#F0E2DC] text-[#3D2B2E] shadow-2xl flex flex-col justify-between animate-slideLeft transition-transform duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#F0E2DC] flex items-center justify-between bg-[#FAF0EA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D88A92] flex items-center justify-center text-white shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#3D2B2E]">
                Tu Carrito
              </h3>
              <p className="text-xs text-[#7A6266]">
                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu lista
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl bg-white text-[#7A6266] hover:text-[#3D2B2E] hover:bg-[#F3E2DA] border border-[#F0E2DC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-[#FAF0EA] border border-[#E8D5CD] flex items-center justify-center text-[#C8747D]">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h4 className="text-base font-serif font-bold text-[#3D2B2E]">Tu carrito está vacío</h4>
            <p className="text-xs text-[#7A6266] max-w-xs">
              Explora nuestra tienda multirrubro y agrega tus productos favoritos.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-[#C8747D] hover:bg-[#B85B65] text-white font-semibold text-xs transition-all shadow-xs"
            >
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            
            {/* Cart Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8C7276] pb-2 border-b border-[#F0E2DC]">
                <span>PRODUCTOS SELECCIONADOS</span>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Vaciar
                </button>
              </div>

              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded-2xl bg-white border border-[#F0E2DC] flex items-center gap-3 shadow-xs"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover bg-[#FAF7F5] border border-[#F0E2DC] shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-[#3D2B2E] truncate">
                      {item.title}
                    </h5>
                    <p className="text-xs font-mono font-bold text-[#C8747D] mt-0.5">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="inline-flex items-center bg-[#FAF7F5] border border-[#F0E2DC] rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 rounded text-[#7A6266] hover:bg-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#3D2B2E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 rounded text-[#7A6266] hover:bg-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[11px] font-mono text-[#8C7276] ml-auto">
                        Subtotal: <strong className="text-[#3D2B2E]">{formatPrice(item.price * item.quantity)}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Customer Form */}
            <div className="p-4 rounded-2xl bg-[#FDF6F0] border border-[#E8D5CD] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8747D] flex items-center gap-2">
                <User className="w-4 h-4" /> Datos de Envío y Contacto
              </h4>

              <div>
                <label className="text-[11px] font-semibold text-[#6E5458] block mb-1">
                  Nombre Completo:
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A88C90]" />
                  <input
                    type="text"
                    required
                    placeholder="Ej: Laura Pérez"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#6E5458] block mb-1">
                  Teléfono / WhatsApp:
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A88C90]" />
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 11 9876-5432"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#6E5458] block mb-1">
                  Dirección de Envío:
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A88C90]" />
                  <input
                    type="text"
                    placeholder="Calle, número, localidad"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#6E5458] block mb-1">
                  Nota / Talle / Detalle:
                </label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 absolute left-3 top-3 text-[#A88C90]" />
                  <textarea
                    rows="2"
                    placeholder="Talle M, regalo, etc."
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
                  />
                </div>
              </div>

              {/* Error Message */}
              {mpError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{mpError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Mercado Pago Checkout Button */}
                <button
                  type="button"
                  onClick={handleCheckoutMercadoPago}
                  disabled={isSubmittingMp || isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#009EE3] hover:bg-[#0082C5] active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all group"
                >
                  {isSubmittingMp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Conectando con Mercado Pago...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                      <span>Pagar con Mercado Pago</span>
                    </>
                  )}
                </button>

                {/* WhatsApp Order Button */}
                <button
                  type="button"
                  onClick={handleCheckoutWhatsApp}
                  disabled={isSubmitting || isSubmittingMp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#2D6A3B] hover:bg-[#23542E] active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span>Finalizar Pedido por WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#F0E2DC] bg-[#FAF7F5] space-y-2">
            <div className="flex justify-between items-baseline text-[#6E5458] text-xs">
              <span>Subtotal del Pedido:</span>
              <span className="font-mono text-sm">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between items-baseline text-[#7A6266] text-[11px]">
              <span>Envío / Entrega:</span>
              <span className="text-[#2D6A3B] font-semibold">A convenir por WhatsApp</span>
            </div>
            <div className="pt-2 border-t border-[#E8D5CD] flex justify-between items-baseline text-[#3D2B2E] font-bold text-base">
              <span>TOTAL A PAGAR:</span>
              <span className="font-mono text-xl text-[#C8747D]">{formatPrice(cartTotal)}</span>
            </div>
          </div>
        )}

      </aside>
    </div>
  );
};
