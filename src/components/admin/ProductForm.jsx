import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Sparkles, Upload, ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { supabase } from '../../lib/supabase';

// ─── Image Uploader Component ───────────────────────────────────────────────
const ImageUploader = ({ currentUrl, onChange }) => {
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Solo se permiten imágenes (JPG, PNG, WEBP, etc.)');
      setUploadState('error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('La imagen no puede superar los 10 MB');
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    setProgress(10);
    setErrorMsg('');

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const filename = `product_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `products/${filename}`;

      setProgress(30);

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      setProgress(80);

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      setProgress(100);
      setUploadState('success');
      onChange(data.publicUrl);
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setErrorMsg(err.message || 'Error al subir. Revisá las políticas del bucket en Supabase.');
      setUploadState('error');
    }
  }, [onChange]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = () => {
    onChange('');
    setUploadState('idle');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <label className="text-xs font-bold text-[#5C4246] uppercase tracking-wider block mb-1.5">
        Imagen del Producto
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
          ${isDragging ? 'border-[#C8747D] bg-[#FDF0F2] scale-[1.01]' : 'border-[#E8D5CD] bg-[#FDFAF8]'}
          ${currentUrl ? 'h-40' : 'h-32'}
        `}
      >
        {/* Preview */}
        {currentUrl && uploadState !== 'uploading' && (
          <div className="absolute inset-0">
            <img
              src={currentUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white text-[#3D2B2E] text-xs font-bold flex items-center gap-1 shadow"
              >
                <Upload className="w-3 h-3" /> Cambiar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-lg bg-white text-red-500 text-xs font-bold flex items-center gap-1 shadow"
              >
                <X className="w-3 h-3" /> Quitar
              </button>
            </div>
            {uploadState === 'success' && (
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        )}

        {/* Subiendo */}
        {uploadState === 'uploading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#FDFAF8]">
            <Loader2 className="w-6 h-6 text-[#C8747D] animate-spin" />
            <p className="text-xs text-[#7A6266] font-medium">Subiendo imagen...</p>
            <div className="w-36 h-1.5 bg-[#F0E2DC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C8747D] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {uploadState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <p className="text-xs text-red-500 text-center font-medium">{errorMsg}</p>
            <button
              type="button"
              onClick={() => setUploadState('idle')}
              className="text-xs text-[#C8747D] underline"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Idle sin imagen */}
        {!currentUrl && uploadState === 'idle' && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#B8A0A4] hover:text-[#C8747D] transition-colors w-full"
          >
            <ImageIcon className="w-8 h-8" />
            <div className="text-center px-4">
              <p className="text-xs font-semibold text-[#5C4246]">
                {isDragging ? '¡Soltá la imagen aquí!' : 'Tocá para seleccionar imagen'}
              </p>
              <p className="text-[10px] text-[#B8A0A4] mt-0.5">
                📱 Celular: abre tu galería &nbsp;·&nbsp; 💻 PC: abre el explorador
              </p>
              <p className="text-[10px] text-[#C8A0A0] mt-0.5">JPG, PNG, WEBP — máx. 10 MB</p>
            </div>
          </button>
        )}
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        id="product-image-input"
      />

      {/* Botón explícito */}
      {!currentUrl && uploadState !== 'uploading' && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 w-full py-2 rounded-xl bg-[#FAF0EA] hover:bg-[#F3E2DA] border border-[#E8D5CD] text-xs text-[#5C4246] font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Upload className="w-3.5 h-3.5 text-[#C8747D]" />
          Abrir galería / explorador de archivos
        </button>
      )}
    </div>
  );
};

// ─── Product Form ─────────────────────────────────────────────────────────────
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

        {/* Form */}
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
                  <option key={cat.id || cat.slug} value={cat.slug}>{cat.name}</option>
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
                type="number" step="0.01" required placeholder="48500"
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
                type="number" step="0.01" placeholder="62000"
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
                type="number" required min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D5CD] text-xs font-mono text-[#3D2B2E] focus:outline-none focus:border-[#C8747D]"
              />
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            currentUrl={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
          />

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
                type="text" placeholder="Ej: MÁS VENDIDO, OFERTA, NUEVO"
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
              type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#FAF0EA] text-[#4A3538] text-xs font-bold hover:bg-[#F3E2DA]"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#C8747D] hover:bg-[#B85B65] text-white font-bold text-xs flex items-center gap-2 shadow-xs disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : productToEdit ? 'Guardar Cambios' : 'Publicar Producto'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
