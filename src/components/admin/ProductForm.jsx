import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const ProductForm = ({ productToEdit, onClose }) => {
  const { categories, addProduct, updateProduct } = useProducts();

  const [formData, setFormData] = useState({
    title: '',
    category_slug: categories[0]?.slug || 'ropa',
    category_name: categories[0]?.name || 'Ropa & Moda',
    price: '',
    original_price: '',
    stock: 10,
    image_url: '',
    description: '',
    badge: '',
    is_featured: true,
    is_active: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || '',
        category_slug: productToEdit.category_slug || 'ropa',
        category_name: productToEdit.category_name || '',
        price: productToEdit.price || '',
        original_price: productToEdit.original_price || '',
        stock: productToEdit.stock ?? 10,
        image_url: productToEdit.image_url || '',
        description: productToEdit.description || '',
        badge: productToEdit.badge || '',
        is_featured: productToEdit.is_featured ?? false,
        is_active: productToEdit.is_active ?? true
      });
    }
  }, [productToEdit]);

  const handleCategoryChange = (e) => {
    const slug = e.target.value;
    const catObj = categories.find((c) => c.slug === slug);
    setFormData((prev) => ({
      ...prev,
      category_slug: slug,
      category_name: catObj ? catObj.name : slug
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock: parseInt(formData.stock, 10),
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    };

    if (productToEdit) {
      await updateProduct(productToEdit.id, payload);
    } else {
      await addProduct(payload);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] border border-[#F0E2DC] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#3D2B2E] my-8 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0E2DC]">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#3D2B2E] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C8747D]" />
              {productToEdit ? 'Editar Producto' : 'Cargar Nuevo Producto'}
            </h3>
            <p className="text-xs text-[#7A6266]">
              Completa la información para publicarlo en la tienda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF0EA] text-[#7A6266] hover:text-[#3D2B2E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1">
                Nombre del Producto: *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Perfume Velvet Rose 50ml"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] focus:outline-none focus:border-[#C8747D]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1">
                Rubro / Categoría: *
              </label>
              <select
                value={formData.category_slug}
                onChange={handleCategoryChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] focus:outline-none focus:border-[#C8747D]"
              >
                {categories.map((cat) => (
                  <option key={cat.id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1">
                Precio Venta ($): *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="48500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs font-mono text-[#3D2B2E] focus:outline-none focus:border-[#C8747D]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1">
                Precio Tachado ($):
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="62000"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs font-mono text-[#7A6266] focus:outline-none focus:border-[#C8747D]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1">
                Stock Disponible: *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs font-mono text-[#3D2B2E] focus:outline-none focus:border-[#C8747D]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1">
              URL de Imagen: *
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] focus:outline-none focus:border-[#C8747D]"
              />
              {formData.image_url && (
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF7F5] border border-[#F0E2DC] shrink-0">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1">
              Descripción:
            </label>
            <textarea
              rows="3"
              placeholder="Detalla materiales, talles, características principales..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] focus:outline-none focus:border-[#C8747D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1">
                Etiqueta (Badge):
              </label>
              <input
                type="text"
                placeholder="Ej: MÁS VENDIDO, OFERTA, NUEVO"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs text-[#3D2B2E] focus:outline-none focus:border-[#C8747D]"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C8747D]"></div>
                <span className="ml-3 text-xs font-bold text-[#4A3538]">Destacar en Home</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E2DC] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#FAF0EA] text-[#4A3538] text-xs font-bold hover:bg-[#F3E2DA]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#C8747D] hover:bg-[#B85B65] text-white font-bold text-xs flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? 'Guardar Cambios' : 'Publicar Producto'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
