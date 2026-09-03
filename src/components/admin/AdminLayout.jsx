import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Package, 
  Layers, 
  ShoppingBag, 
  LogOut, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { ProductListTable } from './ProductListTable';
import { ProductForm } from './ProductForm';
import { CategoryManager } from './CategoryManager';
import { OrdersList } from './OrdersList';

export const AdminLayout = ({ onCloseAdmin }) => {
  const { logoutAdmin } = useAuth();
  const { products, categories, isUsingSupabase } = useProducts();
  const [activeTab, setActiveTab] = useState('products');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#3D2B2E] font-sans">
      
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#F0E2DC] px-4 sm:px-8 py-4 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E8A5AC] to-[#C8747D] flex items-center justify-center text-white shadow-md shadow-[#D88A92]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#3D2B2E] tracking-tight">
              Panel del Emprendedor
            </h1>
            <p className="text-[11px] text-[#7A6266]">
              Gestión total de productos, categorías y stock
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="px-4 py-2 rounded-2xl bg-[#FAF0EA] hover:bg-[#F3E2DA] border border-[#E8D5CD] text-[#4A3538] font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Store className="w-4 h-4 text-[#C8747D]" />
            <span>Volver a la Tienda</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 rounded-2xl bg-white hover:bg-rose-50 text-[#7A6266] hover:text-rose-600 border border-[#F0E2DC] transition-colors shadow-xs"
            title="Cerrar Sesión Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Supabase Status Banner */}
        {!isUsingSupabase && (
          <div className="p-4 rounded-2xl bg-[#FFF0E0] border border-[#FCE0C7] text-[#9E5212] text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#D97724] shrink-0" />
              <span>
                <strong>Modo Local de Prueba:</strong> Puedes ejecutar <code className="bg-[#FDE2C8] px-1.5 py-0.5 rounded font-mono">supabase_schema.sql</code> en Supabase SQL Editor para activar base de datos remota.
              </span>
            </div>
          </div>
        )}

        {/* Dashboard Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#F0E2DC] flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0EA] border border-[#E8D5CD] flex items-center justify-center text-[#C8747D]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#7A6266] font-semibold block">Total Productos</span>
              <span className="text-2xl font-black text-[#3D2B2E] font-mono">{totalProducts}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F0E2DC] flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF5ED] border border-[#C2E0C8] flex items-center justify-center text-[#2D6A3B]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#7A6266] font-semibold block">En Stock</span>
              <span className="text-2xl font-black text-[#2D6A3B] font-mono">{inStockCount}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F0E2DC] flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#7A6266] font-semibold block">Sin Stock</span>
              <span className="text-2xl font-black text-rose-600 font-mono">{outOfStockCount}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F0E2DC] flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#EFE7F7] border border-[#D6C4E7] flex items-center justify-center text-[#7C52A5]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#7A6266] font-semibold block">Rubros Activos</span>
              <span className="text-2xl font-black text-[#7C52A5] font-mono">{categories.length}</span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#F0E2DC] pb-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] text-white shadow-xs'
                : 'text-[#7A6266] hover:bg-white hover:text-[#3D2B2E]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Productos ({totalProducts})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] text-white shadow-xs'
                : 'text-[#7A6266] hover:bg-white hover:text-[#3D2B2E]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorías ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] text-white shadow-xs'
                : 'text-[#7A6266] hover:bg-white hover:text-[#3D2B2E]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos Recibidos</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'products' && (
          <ProductListTable
            onEditProduct={handleEditProduct}
            onCreateNewProduct={handleCreateProduct}
          />
        )}

        {activeTab === 'categories' && <CategoryManager />}

        {activeTab === 'orders' && <OrdersList />}

      </main>

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          productToEdit={editingProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}

    </div>
  );
};
