import React from 'react';
import { Layers, Tag } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const CategoryManager = () => {
  const { categories, products } = useProducts();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#F0E2DC] rounded-3xl p-6 space-y-4 shadow-xs text-[#3D2B2E]">
        <h3 className="text-base font-serif font-bold text-[#3D2B2E] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#C8747D]" />
          Categorías & Rubros Activos
        </h3>
        <p className="text-xs text-[#7A6266]">
          Visualiza los rubros que organizan tus productos en el menú principal
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_slug === cat.slug).length;
            return (
              <div
                key={cat.id || cat.slug}
                className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#F0E2DC] flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F9EAE8] border border-[#F3D5D8] flex items-center justify-center text-[#C8747D]">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#3D2B2E]">{cat.name}</h4>
                    <p className="text-[11px] text-[#7A6266]">{count} productos cargados</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
