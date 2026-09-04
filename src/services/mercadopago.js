import { supabase } from '../lib/supabase';

/**
 * Creates a Mercado Pago Checkout Preference
 */
export const createMercadoPagoCheckout = async (cartItems, customerInfo) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('El carrito está vacío');
  }

  // 1. Guardar orden previa en Supabase
  let orderId = null;
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const { data: orderData } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: customerInfo?.name || 'Cliente Mercado Pago',
          customer_phone: customerInfo?.phone || 'N/A',
          customer_address: customerInfo?.address || 'A convenir',
          notes: customerInfo?.notes ? `[Mercado Pago] ${customerInfo.notes}` : '[Mercado Pago]',
          total_amount: totalAmount,
          status: 'pending'
        }
      ])
      .select();

    if (orderData && orderData.length > 0) {
      orderId = orderData[0].id;
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
  } catch (e) {
    console.log('Order creation log warning:', e);
  }

  // 2. Intentar llamar al backend Serverless /api/create-preference de Vercel
  try {
    const apiResponse = await fetch('/api/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems, customerInfo, orderId })
    });

    const data = await apiResponse.json();

    if (apiResponse.ok && (data.init_point || data.sandbox_init_point)) {
      return data.init_point || data.sandbox_init_point;
    }

    if (data && data.error) {
      throw new Error(data.error);
    }
  } catch (backendErr) {
    if (backendErr.message && !backendErr.message.includes('Failed to fetch') && !backendErr.message.includes('Unexpected token')) {
      throw backendErr;
    }
    console.log('Intento de fallback local para desarrollo...');
  }

  // 3. Fallback para desarrollo local si MP_ACCESS_TOKEN existe en el cliente
  const accessToken = import.meta.env.MP_ACCESS_TOKEN || import.meta.env.VITE_MP_ACCESS_TOKEN;
  if (accessToken) {
    const redirectSuccess = orderId 
      ? `${window.location.origin}/?payment_status=approved&order_id=${orderId}`
      : `${window.location.origin}/?payment_status=approved`;

    const preferencePayload = {
      items: cartItems.map(item => ({
        title: item.title,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
        currency_id: 'ARS'
      })),
      payer: {
        name: customerInfo?.name || 'Cliente',
        phone: customerInfo?.phone ? { number: customerInfo.phone } : undefined,
        address: customerInfo?.address ? { street_name: customerInfo.address } : undefined
      },
      external_reference: orderId ? String(orderId) : undefined,
      back_urls: {
        success: redirectSuccess,
        failure: `${window.location.origin}/?payment_status=failure`,
        pending: `${window.location.origin}/?payment_status=pending`
      },
      auto_return: 'approved',
      statement_descriptor: 'TIENDA ROOH'
    };

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferencePayload)
    });

    const resData = await res.json();
    if (resData.init_point) return resData.init_point;
    if (resData.sandbox_init_point) return resData.sandbox_init_point;
    throw new Error(resData.message || resData.error || 'Error al conectar con Mercado Pago');
  }

  throw new Error('No se pudo procesar el pago. Asegúrate de hacer un REDEPLOY en Vercel.');
};
