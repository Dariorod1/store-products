/**
 * Formats a numeric price into a currency string (e.g. $ 48.500)
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$ 0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount).replace('ARS', '$');
};

/**
 * Calculates discount percentage between original price and current price
 */
export const calculateDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return null;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `${discount}% OFF`;
};

/**
 * Generates a formatted WhatsApp direct order URL with cart summary and customer details
 */
export const generateWhatsAppUrl = (cartItems, customerInfo = {}, whatsappNumber = '5493863434888') => {
  const storeName = import.meta.env.VITE_STORE_NAME || 'Mi Tienda';
  const cleanNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || whatsappNumber).replace(/[^0-9]/g, '');

  let text = `🛒 *NUEVO PEDIDO - ${storeName}*\n`;
  text += `-----------------------------------\n\n`;

  if (customerInfo.name) {
    text += `👤 *Cliente:* ${customerInfo.name}\n`;
  }
  if (customerInfo.phone) {
    text += `📱 *Teléfono:* ${customerInfo.phone}\n`;
  }
  if (customerInfo.address) {
    text += `📍 *Dirección de envío:* ${customerInfo.address}\n`;
  }
  if (customerInfo.notes) {
    text += `📝 *Notas:* ${customerInfo.notes}\n`;
  }
  
  text += `\n📦 *DETALLE DEL PEDIDO:*\n`;

  let total = 0;
  cartItems.forEach((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    total += itemSubtotal;
    text += `${index + 1}. *${item.title}*\n`;
    text += `   Cantidad: ${item.quantity} x ${formatPrice(item.price)} = *${formatPrice(itemSubtotal)}*\n`;
  });

  text += `\n-----------------------------------\n`;
  text += `💰 *TOTAL A PAGAR:* *${formatPrice(total)}*\n\n`;
  text += `¡Hola! Me gustaría confirmar la disponibilidad y coordinar la entrega/pago. ¡Gracias!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
};
