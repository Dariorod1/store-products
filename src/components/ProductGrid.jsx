import React from 'react';
import { ProductCard } from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { ArrowUpDown, RefreshCw, SearchX, ArrowLeft } from 'lucide-react';

export const ProductGrid = ({ onSelectProduct }) => {
  const { 
    filteredProducts, 
    loading, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy, 
    setSortBy,
    categories,
    featuredOnly,
    setFeaturedOnly,
    refreshProducts
  } = useProducts();

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const isFiltered = selectedCategory !== 'all' || featuredOnly || Boolean(searchQuery && searchQuery.trim());

  return (
    <section className="py-6 sm:py-8 bg-[#FAF7F5] min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0E2DC]">
          
          {/* Active Filter Title & Counter */}
          <div>
            {isFiltered && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setFeaturedOnly(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#C8747D] hover:underline font-semibold mb-1 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver al inicio / Ver todos los rubros</span>
              </button>
            )}
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3D2B2E] tracking-tight flex items-center gap-2">
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : featuredOnly
                ? '⭐ Productos Destacados'
                : selectedCategory === 'all'
                ? 'Catálogo de Productos'
                : `${currentCategoryObj?.name || selectedCategory}`}
            </h2>
            <p className="text-xs text-[#7A6266] mt-0.5">
              Mostrando <span className="text-[#C8747D] font-bold">{filteredProducts.length}</span> productos seleccionados
            </p>
          </div>

          {/* Sort Selector & Refresh */}
          <div className="flex items-center gap-2">
            
            <div className="flex items-center gap-2 bg-white border border-[#F0E2DC] rounded-2xl px-3 py-1.5 text-xs text-[#4A3538] shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C8747D]" />
              <span className="hidden sm:inline font-semibold">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[#3D2B2E] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="price-low">Menor Precio</option>
                <option value="price-high">Mayor Precio</option>
                <option value="newest">Más Recientes</option>
              </select>
            </div>

            <button
              onClick={refreshProducts}
              className="p-2 rounded-2xl bg-white border border-[#F0E2DC] text-[#7A6266] hover:text-[#3D2B2E] hover:bg-[#FDF6F0] transition-colors shadow-xs"
              title="Actualizar catálogo"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C8747D]' : ''}`} />
            </button>
          </div>

        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-[#F0E2DC] rounded-2xl p-3 h-[280px] animate-pulse flex flex-col justify-between">
                <div className="bg-[#FAF0EA] rounded-xl aspect-square w-full" />
                <div className="space-y-2 mt-2">
                  <div className="h-3 bg-[#FAF0EA] rounded w-3/4" />
                  <div className="h-3 bg-[#FAF0EA] rounded w-1/2" />
                </div>
                <div className="h-8 bg-[#FAF0EA] rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          
          /* Responsive 2-column mobile, 3 tablet, 4 desktop Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          
          /* Empty State */
          <div className="bg-white border border-[#F0E2DC] rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 my-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#F9EAE8] border border-[#F3D5D8] flex items-center justify-center text-[#C8747D] mx-auto">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#3D2B2E]">
              No encontramos productos
            </h3>
            <p className="text-xs text-[#7A6266]">
              {searchQuery
                ? `No hay coincidencias para "${searchQuery}". Intenta buscar otro término.`
                : 'No hay productos en esta categoría actualmente.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-[#FAF0EA] text-[#4A3538] text-xs font-semibold hover:bg-[#F3E2DA]"
                >
                  Limpiar Búsqueda
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setFeaturedOnly(false);
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-[#C8747D] text-white text-xs font-semibold hover:bg-[#B85B65]"
              >
                Ver Todo el Catálogo
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
