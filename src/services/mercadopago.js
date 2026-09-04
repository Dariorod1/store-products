import { supabase } from '../lib/supabase';

/**
 * Creates a Mercado Pago Checkout Preference
 * First tries backend endpoint `/api/create-preference`, then falls back to direct REST API call.
 */
export const createMercadoPagoCheckout = async (cartItems, customerInfo) => {
  const accessToken = import.meta.env.MP_ACCESS_TOKEN || import.meta.env.VITE_MP_ACCESS_TOKEN;
  
  if (!cartItems || cartItems.length === 0) {
    throw new Error('El carrito está vacío');
  }

  // 1. Guardar orden previa en Supabase
  let orderId = null;
  try {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

  // 2. Formatear datos para la Preferencia de Mercado Pago
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
    back_urls: {
      success: window.location.origin,
      failure: window.location.origin,
      pending: window.location.origin
    },
    auto_return: 'approved',
    statement_descriptor: 'TIENDA ROOH'
  };

  // 3. Intentar primero con la API Serverless /api/create-preference
  try {
    const apiResponse = await fetch('/api/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems, customerInfo })
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data.init_point) {
        return data.init_point;
      }
    }
  } catch (err) {
    console.log('Backend serverless fallback to direct MP REST API call');
  }

  // 4. Fallback directo a la API de Mercado Pago usando AccessToken
  if (!accessToken) {
    throw new Error('No se encontró la clave MP_ACCESS_TOKEN de Mercado Pago.');
  }

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(preferencePayload)
  });

  const resData = await res.json();

  if (resData.init_point) {
    return resData.init_point;
  } else if (resData.sandbox_init_point) {
    return resData.sandbox_init_point;
  } else {
    throw new Error(resData.message || resData.error || 'No se pudo generar la preferencia de Mercado Pago');
  }
};
