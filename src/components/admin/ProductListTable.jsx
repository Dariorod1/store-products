import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search, AlertTriangle } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../utils/formatters';

export const ProductListTable = ({ onEditProduct, onCreateNewProduct }) => {
  const { products, deleteProduct, toggleStock } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-4">
      {/* Search & Add New Product Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A88C90]" />
          <input
            type="text"
            placeholder="Buscar por título o rubro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
          />
        </div>

        <button
          onClick={onCreateNewProduct}
          className="py-2.5 px-4 rounded-2xl bg-[#C8747D] hover:bg-[#B85B65] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#F0E2DC] rounded-2xl overflow-hidden shadow-xs text-[#3D2B2E]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF0EA] text-[#6E5458] font-bold uppercase tracking-wider border-b border-[#F0E2DC]">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Rubro</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E2DC]">
              {filtered.length > 0 ? (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF7F5] transition-colors">
                    
                    {/* Thumbnail & Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image_url}
                          alt={prod.title}
                          className="w-12 h-12 rounded-xl object-cover bg-[#FAF7F5] border border-[#F0E2DC] shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#3D2B2E] text-xs truncate max-w-[200px] sm:max-w-[280px]">
                            {prod.title}
                          </h4>
                          {prod.badge && (
                            <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-[#F9EAE8] text-[#B85B65] font-bold text-[9px] uppercase border border-[#F3D5D8]">
                              {prod.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F5] text-[#C8747D] font-semibold border border-[#F0E2DC] text-[11px]">
                        {prod.category_name || prod.category_slug}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-mono font-bold text-[#3D2B2E] text-xs">
                      {formatPrice(prod.price)}
                    </td>

                    {/* Stock amount */}
                    <td className="p-4 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        prod.stock <= 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[#FAF7F5] text-[#3D2B2E]'
                      }`}>
                        {prod.stock} un.
                      </span>
                    </td>

                    {/* Stock Quick Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleStock(prod.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition-all border ${
                          prod.stock > 0
                            ? 'bg-[#EBF5ED] text-[#2D6A3B] border-[#C2E0C8] hover:bg-[#DDF0E0]'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                        title="Haz clic para alternar stock"
                      >
                        {prod.stock > 0 ? 'EN STOCK' : 'AGOTADO'}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProduct(prod)}
                          className="p-2 rounded-xl bg-[#FAF0EA] hover:bg-[#F3E2DA] text-[#4A3538] border border-[#E8D5CD] transition-colors"
                          title="Editar Producto"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#C8747D]" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(prod.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                          title="Eliminar Producto"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#7A6266] text-xs">
                    No hay productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#F0E2DC] rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif font-bold text-[#3D2B2E]">¿Eliminar este producto?</h4>
            <p className="text-xs text-[#7A6266]">
              Esta acción no se puede deshacer y el producto dejará de estar visible en la tienda.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#FAF0EA] text-[#4A3538] font-bold text-xs hover:bg-[#F3E2DA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
