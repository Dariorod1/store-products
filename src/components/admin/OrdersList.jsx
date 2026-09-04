import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Phone, MapPin, Clock, CheckCircle2, RefreshCw, 
  Eye, X, User, FileText, ExternalLink, Copy, Check, Package, AlertCircle, MessageCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../utils/formatters';
import { useBackHandler } from '../../hooks/useBackHandler';

export const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [copied, setCopied] = useState(false);

  useBackHandler(modalOpen && !!selectedOrder, () => setModalOpen(false));

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      } else {
        // Fallback sample data
        setOrders([
          {
            id: 'ord-101',
            customer_name: 'María González',
            customer_phone: '11 5432-8901',
            customer_address: 'Av. Corrientes 1234, 4to B, CABA',
            notes: 'Dejar en portería si no contesto el timbre',
            total_amount: 54900,
            status: 'pending',
            created_at: new Date().toISOString(),
            order_items: [
              { id: 'item-1', product_title: 'Perfume Floral Rose 50ml', unit_price: 32900, quantity: 1, subtotal: 32900 },
              { id: 'item-2', product_title: 'Vestido Lino Soft Beige', unit_price: 22000, quantity: 1, subtotal: 22000 }
            ]
          },
          {
            id: 'ord-102',
            customer_name: 'Carlos Rodríguez',
            customer_phone: '11 8765-4321',
            customer_address: 'Calle Mitre 456, Quilmes',
            notes: 'Envío preferentemente por la tarde',
            total_amount: 32500,
            status: 'completed',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            order_items: [
              { id: 'item-3', product_title: 'Sombra de Ojos Glow Bronze', unit_price: 16250, quantity: 2, subtotal: 32500 }
            ]
          }
        ]);
      }
    } catch (e) {
      console.log('Using sample orders list fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetail = async (ord) => {
    setSelectedOrder(ord);
    setModalOpen(true);

    // If order items were not loaded in initial query, fetch them now
    if (!ord.order_items || ord.order_items.length === 0) {
      setLoadingItems(true);
      try {
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', ord.id);

        if (items) {
          setSelectedOrder((prev) => prev ? { ...prev, order_items: items } : null);
        }
      } catch (e) {
        console.log('Error fetching order items:', e);
      } finally {
        setLoadingItems(false);
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch (err) {
      console.log('Updating order status locally');
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const copyOrderSummary = () => {
    if (!selectedOrder) return;
    const itemsList = (selectedOrder.order_items || [])
      .map((it) => `- ${it.product_title} x${it.quantity} (${formatPrice(it.subtotal)})`)
      .join('\n');

    const summary = `📌 RESUMEN DE PEDIDO #${selectedOrder.id.slice(0, 8)}
👤 Cliente: ${selectedOrder.customer_name}
📞 Teléfono: ${selectedOrder.customer_phone}
📍 Dirección: ${selectedOrder.customer_address || 'A convenir'}
📝 Notas: ${selectedOrder.notes || 'Sin notas'}

🛒 Productos:
${itemsList || 'Sin detalle de productos'}

💰 TOTAL: ${formatPrice(selectedOrder.total_amount)}
Estado: ${selectedOrder.status === 'completed' ? 'COMPLETADO' : selectedOrder.status === 'cancelled' ? 'CANCELADO' : 'PENDIENTE'}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = (phone) => phone ? phone.replace(/[^0-9]/g, '') : '';

  return (
    <div className="space-y-4 text-[#3D2B2E]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-serif font-bold text-[#3D2B2E] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C8747D]" />
            Historial de Pedidos Registrados
          </h3>
          <p className="text-xs text-[#7A6266] mt-0.5">
            Haz clic en cualquier pedido para ver el desglose completo de productos y cliente.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          title="Actualizar lista de pedidos"
          className="p-2 rounded-xl bg-white border border-[#F0E2DC] text-[#7A6266] hover:text-[#3D2B2E] hover:bg-[#FAF0EA] transition-colors shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C8747D]' : ''}`} />
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => openOrderDetail(ord)}
              className="p-4 rounded-2xl bg-white border border-[#F0E2DC] hover:border-[#D88A92] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs transition-all cursor-pointer hover:shadow-md group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#3D2B2E] text-sm group-hover:text-[#C8747D] transition-colors flex items-center gap-1.5">
                    {ord.customer_name}
                    <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#C8747D] transition-opacity" />
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ord.status === 'completed'
                      ? 'bg-[#EBF5ED] text-[#2D6A3B] border border-[#C2E0C8]'
                      : ord.status === 'cancelled'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-[#FFF0E0] text-[#D97724] border border-[#FCE0C7]'
                  }`}>
                    {ord.status === 'completed' ? 'Completado' : ord.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                  </span>
                  {ord.order_items && ord.order_items.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF0EA] text-[#8C7276] text-[10px] font-semibold border border-[#F0E2DC]">
                      {ord.order_items.length} {ord.order_items.length === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-[#7A6266] flex-wrap">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#C8747D]" /> {ord.customer_phone}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#C8747D] shrink-0" /> {ord.customer_address || 'A convenir'}
                  </span>
                  <span className="flex items-center gap-1 text-[#9E8286] font-mono">
                    <Clock className="w-3.5 h-3.5" /> {new Date(ord.created_at).toLocaleDateString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F0E2DC] shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-[#8C7276] block uppercase font-bold">Total Pedido</span>
                  <span className="font-mono font-black text-base text-[#C8747D]">{formatPrice(ord.total_amount)}</span>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {ord.status !== 'completed' && (
                    <button
                      onClick={(e) => updateOrderStatus(ord.id, 'completed', e)}
                      title="Marcar como Completado"
                      className="px-3 py-1.5 rounded-xl bg-[#EBF5ED] hover:bg-[#DDF0E0] border border-[#C2E0C8] text-[#2D6A3B] text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completar
                    </button>
                  )}
                  <button
                    onClick={() => openOrderDetail(ord)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF0EA] hover:bg-[#F3E2DA] border border-[#E8D5CD] text-[#7A6266] hover:text-[#3D2B2E] text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C8747D]" /> Detalle
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-[#7A6266] text-xs bg-white border border-[#F0E2DC] rounded-2xl">
            No hay pedidos registrados aún.
          </div>
        )}
      </div>

      {/* ORDER DETAIL MODAL */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-[#FFFDF9] border border-[#F0E2DC] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-[#3D2B2E] space-y-0 my-8 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-[#FAF0EA] border-b border-[#F0E2DC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C8747D] flex items-center justify-center text-white shadow-xs">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-[#3D2B2E]">
                      Detalle del Pedido #{selectedOrder.id.slice(0, 8)}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedOrder.status === 'completed'
                        ? 'bg-[#EBF5ED] text-[#2D6A3B] border border-[#C2E0C8]'
                        : selectedOrder.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-[#FFF0E0] text-[#D97724] border border-[#FCE0C7]'
                    }`}>
                      {selectedOrder.status === 'completed' ? 'Completado' : selectedOrder.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A6266] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    Registrado el {new Date(selectedOrder.created_at).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-white border border-[#F0E2DC] text-[#7A6266] hover:text-[#3D2B2E] hover:bg-[#F3E2DA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Customer Info Card */}
              <div className="p-4 rounded-2xl bg-[#FDF6F0] border border-[#E8D5CD] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8747D] flex items-center gap-2">
                    <User className="w-4 h-4" /> Información del Cliente
                  </h4>
                  {selectedOrder.customer_phone && (
                    <a
                      href={`https://wa.me/${cleanPhone(selectedOrder.customer_phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-xl bg-[#2D6A3B] hover:bg-[#23542E] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Escribir por WhatsApp
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8C7276] font-semibold block">Nombre:</span>
                    <span className="font-bold text-[#3D2B2E]">{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-[#8C7276] font-semibold block">Teléfono:</span>
                    <span className="font-mono text-[#3D2B2E]">{selectedOrder.customer_phone || 'No especificado'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#8C7276] font-semibold block">Dirección de Entrega:</span>
                    <span className="text-[#3D2B2E]">{selectedOrder.customer_address || 'A convenir con el vendedor'}</span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="sm:col-span-2 p-2.5 rounded-xl bg-white border border-[#E8D5CD] text-[#7A6266]">
                      <span className="text-[#C8747D] font-bold block text-[11px] mb-0.5 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Notas / Observaciones:
                      </span>
                      <p className="italic text-xs">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8747D] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Desglose de Productos
                </h4>

                {loadingItems ? (
                  <div className="p-6 text-center text-xs text-[#7A6266] flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C8747D]" /> Cargando items...
                  </div>
                ) : selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  <div className="border border-[#F0E2DC] rounded-2xl overflow-hidden bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF0EA] text-[#6E5458] border-b border-[#F0E2DC] font-semibold">
                        <tr>
                          <th className="p-3">Producto</th>
                          <th className="p-3 text-center">Cant.</th>
                          <th className="p-3 text-right">P. Unit.</th>
                          <th className="p-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0E2DC] text-[#3D2B2E]">
                        {selectedOrder.order_items.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-[#FAF7F5]">
                            <td className="p-3 font-semibold text-[#3D2B2E]">
                              {item.product_title || 'Producto sin título'}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-[#8C7276]">
                              {item.quantity}
                            </td>
                            <td className="p-3 text-right font-mono text-[#7A6266]">
                              {formatPrice(item.unit_price)}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-[#C8747D]">
                              {formatPrice(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>No se registraron items detallados para este pedido (compra rápida). Total cargado: {formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                )}
              </div>

              {/* Total & Summary Box */}
              <div className="p-4 rounded-2xl bg-[#FAF0EA] border border-[#F0E2DC] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8C7276] font-semibold uppercase block">Monto Total del Pedido</span>
                  <span className="text-xs text-[#7A6266]">Incluye todos los ítems listados</span>
                </div>
                <span className="text-xl font-mono font-black text-[#C8747D]">
                  {formatPrice(selectedOrder.total_amount)}
                </span>
              </div>

              {/* Order Status Control Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#F0E2DC]">
                <span className="text-[11px] font-bold text-[#8C7276] uppercase tracking-wider block">
                  Cambiar Estado del Pedido:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={(e) => updateOrderStatus(selectedOrder.id, 'pending', e)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedOrder.status === 'pending'
                        ? 'bg-[#FFF0E0] text-[#D97724] border-2 border-[#D97724]'
                        : 'bg-white text-[#7A6266] border border-[#F0E2DC] hover:bg-[#FAF0EA]'
                    }`}
                  >
                    Pendiente
                  </button>
                  <button
                    onClick={(e) => updateOrderStatus(selectedOrder.id, 'completed', e)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      selectedOrder.status === 'completed'
                        ? 'bg-[#EBF5ED] text-[#2D6A3B] border-2 border-[#2D6A3B]'
                        : 'bg-white text-[#7A6266] border border-[#F0E2DC] hover:bg-[#FAF0EA]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                  </button>
                  <button
                    onClick={(e) => updateOrderStatus(selectedOrder.id, 'cancelled', e)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedOrder.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800 border-2 border-rose-600'
                        : 'bg-white text-[#7A6266] border border-[#F0E2DC] hover:bg-[#FAF0EA]'
                    }`}
                  >
                    Cancelado
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF0EA] border-t border-[#F0E2DC] flex items-center justify-between gap-3">
              <button
                onClick={copyOrderSummary}
                className="px-4 py-2 rounded-xl bg-white border border-[#E8D5CD] hover:border-[#C8747D] text-[#7A6266] hover:text-[#3D2B2E] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#C8747D]" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Resumen'}</span>
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#C8747D] hover:bg-[#B85B65] text-white text-xs font-bold transition-all shadow-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

