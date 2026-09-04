import React from 'react';
import { 
  CheckCircle2, 
  ShoppingBag, 
  MessageCircle, 
  ExternalLink, 
  Share2, 
  X, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice } from '../utils/formatters';
import { useBackHandler } from '../hooks/useBackHandler';

export const PaymentSuccessModal = ({ paymentDetails, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  useBackHandler(!!paymentDetails, onClose);

  React.useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch (e) {
      console.log('Confetti effect unavailable');
    }
  }, []);

  if (!paymentDetails) return null;

  const { orderId, paymentId, totalAmount, customerName, items } = paymentDetails;

  const handleCopySummary = () => {
    const summary = `✅ PAGO CONFIRMADO - MERCADO PAGO
📌 Pedido ID: #${orderId ? orderId.slice(0, 8) : 'N/A'}
💳 Transacción MP: #${paymentId || 'Aprobado'}
👤 Cliente: ${customerName || 'Cliente Web'}
💰 Total Abonado: ${formatPrice(totalAmount || 0)}

¡Pago verificado y registrado exitosamente!`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppNotify = () => {
    const cleanOrder = orderId ? orderId.slice(0, 8) : '';
    const text = `¡Hola! Acabo de realizar y abonar el pedido #${cleanOrder} por Mercado Pago (Transacción MP #${paymentId || 'Aprobado'}).\n\n💰 Total: ${formatPrice(totalAmount || 0)}\n👤 Nombre: ${customerName || 'Cliente'}\n\nQuedo a la espera de la confirmación de envío. ¡Muchas gracias!`;
    window.open(`https://wa.me/5493863434888?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#FFFDF9] border border-[#F0E2DC] rounded-3xl shadow-2xl overflow-hidden text-[#3D2B2E] my-6 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Header Banner */}
        <div className="bg-gradient-to-r from-[#2D6A3B] to-[#1E4D27] p-6 text-white text-center relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center mb-3 shadow-inner border border-white/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-300" />
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[11px] font-bold uppercase tracking-wider inline-block mb-2">
            Mercado Pago Verified
          </span>

          <h2 className="text-2xl font-serif font-bold tracking-tight">
            ¡Pago Aprobado con Éxito!
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            Tu pago ha sido procesado de forma segura y el pedido ya ingresó a nuestra base de datos.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Payment Detail Box */}
          <div className="p-4 rounded-2xl bg-[#FAF0EA] border border-[#F0E2DC] space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#F0E2DC]">
              <span className="text-[#8C7276] font-semibold">Estado del Pago:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EBF5ED] text-[#2D6A3B] font-bold border border-[#C2E0C8]">
                APROBADO & COMPLETADO
              </span>
            </div>

            {orderId && (
              <div className="flex justify-between items-center">
                <span className="text-[#8C7276] font-semibold">Número de Pedido:</span>
                <span className="font-mono font-bold text-[#3D2B2E]">#{orderId.slice(0, 8)}</span>
              </div>
            )}

            {paymentId && (
              <div className="flex justify-between items-center">
                <span className="text-[#8C7276] font-semibold">ID Transacción Mercado Pago:</span>
                <span className="font-mono text-[#7A6266]">{paymentId}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-[#F0E2DC]">
              <span className="text-[#3D2B2E] font-bold text-sm">Monto Total Pagado:</span>
              <span className="font-mono font-black text-lg text-[#C8747D]">
                {formatPrice(totalAmount || 0)}
              </span>
            </div>
          </div>

          {/* Customer Trust info */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-900 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tu pedido ya fue registrado en el Panel de Administración.</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Hemos vaciado tu carrito y guardado el comprobante. Podés notificar al vendedor por WhatsApp para coordinar el envío prioritario.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleWhatsAppNotify}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2D6A3B] hover:bg-[#23542E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Avisar al Vendedor por WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopySummary}
                className="py-2.5 px-3 rounded-xl bg-white border border-[#E8D5CD] hover:border-[#C8747D] text-[#7A6266] hover:text-[#3D2B2E] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#C8747D]" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Recibo'}</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-[#C8747D] hover:bg-[#B85B65] text-white text-xs font-bold transition-all shadow-xs"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
