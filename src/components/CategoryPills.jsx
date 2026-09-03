import React from 'react';
import { 
  Shirt, 
  Sparkles, 
  Gamepad2, 
  Headphones, 
  Home, 
  ShoppingBag,
  SlidersHorizontal,
  Star
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const iconMap = {
  Shirt: Shirt,
  Sparkles: Sparkles,
  Gamepad2: Gamepad2,
  Headphones: Headphones,
  Home: Home,
  ShoppingBag: ShoppingBag
};

export const CategoryPills = () => {
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    featuredOnly, 
    setFeaturedOnly,
    products 
  } = useProducts();

  return (
    <div className="bg-[#FAF7F5]/90 border-b border-[#F0E2DC] py-3.5 sticky top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          
          {/* Label icon */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C7276] uppercase tracking-wider pr-2 shrink-0 border-r border-[#E8D5CD]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8747D]" />
            <span className="hidden sm:inline">Rubros:</span>
          </div>

          {/* All Categories Pill */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              setFeaturedOnly(false);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 ${
              selectedCategory === 'all' && !featuredOnly
                ? 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] text-white shadow-sm scale-105'
                : 'bg-white border border-[#F0E2DC] text-[#4A3538] hover:bg-[#F9EAE8] hover:border-[#E8C5C8]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Todos los Rubros</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              selectedCategory === 'all' && !featuredOnly ? 'bg-black/10 text-white' : 'bg-[#FAF0EA] text-[#8C7276]'
            }`}>
              {products.length}
            </span>
          </button>

          {/* Featured Filter Pill */}
          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 ${
              featuredOnly
                ? 'bg-gradient-to-r from-[#E5A93C] to-[#D97724] text-white shadow-sm scale-105'
                : 'bg-white border border-[#F0E2DC] text-[#4A3538] hover:bg-[#FFF0E0]'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C]" />
            <span>Destacados</span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || ShoppingBag;
            const isSelected = selectedCategory === cat.slug && !featuredOnly;
            const count = products.filter(p => p.category_slug === cat.slug).length;

            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setFeaturedOnly(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] text-white shadow-sm scale-105'
                    : 'bg-white border border-[#F0E2DC] text-[#4A3538] hover:bg-[#F9EAE8] hover:border-[#E8C5C8]'
                }`}
              >
                <IconComp className="w-3.5 h-3.5 text-[#C8747D]" />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/10 text-white' : 'bg-[#FAF0EA] text-[#8C7276]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};
