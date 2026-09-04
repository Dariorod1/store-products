export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN || process.env.VITE_MP_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ error: 'Falta la credencial MP_ACCESS_TOKEN en Vercel' });
  }

  try {
    const { items, customerInfo, orderId } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Lista de items inválida o vacía' });
    }

    const origin = req.headers.origin || 'https://tiendarooh.vercel.app';
    const redirectSuccess = orderId 
      ? `${origin}/?payment_status=approved&order_id=${orderId}`
      : `${origin}/?payment_status=approved`;

    const preferencePayload = {
      items: items.map(item => ({
        title: String(item.title || 'Producto'),
        unit_price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        currency_id: 'ARS'
      })),
      payer: {
        name: customerInfo?.name || 'Cliente',
        phone: customerInfo?.phone ? { number: String(customerInfo.phone) } : undefined,
        address: customerInfo?.address ? { street_name: String(customerInfo.address) } : undefined
      },
      external_reference: orderId ? String(orderId) : undefined,
      back_urls: {
        success: redirectSuccess,
        failure: `${origin}/?payment_status=failure`,
        pending: `${origin}/?payment_status=pending`
      },
      auto_return: 'approved',
      statement_descriptor: 'TIENDA ROOH'
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferencePayload)
    });

    const data = await mpResponse.json();

    if (data.init_point) {
      return res.status(200).json({ 
        init_point: data.init_point, 
        sandbox_init_point: data.sandbox_init_point,
        id: data.id 
      });
    } else {
      return res.status(400).json({ 
        error: data.message || 'Error al generar la preferencia en Mercado Pago', 
        details: data 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
