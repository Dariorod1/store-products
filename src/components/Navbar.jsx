import React from 'react';
import { STORE_NAME } from '../lib/config';
import { 
  Search, 
  Menu, 
  X, 
  ShoppingCart, 
  UserCheck, 
  Sparkles,
  ShieldCheck,
  Store
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

export const Navbar = ({ onOpenSidebar, onOpenAdmin }) => {
  const { cartCount, cartTotal, setIsCartOpen } = useCart();
  const { searchQuery, setSearchQuery } = useProducts();
  const { isAdminLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#F0E2DC] text-[#3D2B2E] transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        
        {/* Left Section: Hamburger Menu & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2.5 rounded-2xl bg-[#FAF0EA] border border-[#E8D5CD] hover:bg-[#F3E2DA] text-[#4A3538] transition-all duration-200 flex items-center gap-2 group shadow-xs"
            title="Abrir menú de categorías"
            aria-label="Menú principal"
          >
            <Menu className="w-5 h-5 text-[#C8747D] group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-semibold text-xs text-[#5C4246]">
              Categorías
            </span>
          </button>

          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E8A5AC] via-[#D88A92] to-[#C8747D] flex items-center justify-center shadow-md shadow-[#D88A92]/20 group-hover:scale-105 transition-all duration-300">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#3D2B2E]">
                {STORE_NAME}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8747D] -mt-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#E8A5AC] inline" /> Tienda Multirrubro
              </span>
            </div>
          </a>
        </div>

        {/* Middle Section: Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A88C90]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ropa, perfumes, juguetes..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#FDF6F0] border border-[#E8D5CD] rounded-full text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D] focus:ring-2 focus:ring-[#C8747D]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A88C90] hover:text-[#3D2B2E] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Admin Entry & Cart Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Panel Button */}
          <button
            onClick={onOpenAdmin}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-xs ${
              isAdminLoggedIn
                ? 'bg-[#EBF5ED] text-[#2D6A3B] border-[#C2E0C8] hover:bg-[#DDF0E0]'
                : 'bg-[#FAF0EA] text-[#5C4246] border-[#E8D5CD] hover:bg-[#F3E2DA]'
            }`}
            title={isAdminLoggedIn ? 'Panel de Emprendedor Activo' : 'Ingreso para el Emprendedor'}
          >
            {isAdminLoggedIn ? (
              <>
                <UserCheck className="w-4 h-4 text-[#2D6A3B]" />
                <span className="hidden sm:inline">Panel Admin</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-[#C8747D]" />
                <span className="hidden sm:inline">Emprendedor</span>
              </>
            )}
          </button>

          {/* Cart Toggle Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D88A92] to-[#C8747D] hover:from-[#C8747D] hover:to-[#B85B65] text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-[#D88A92]/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span className="hidden sm:inline font-medium">Carrito</span>
            {cartCount > 0 && (
              <span className="bg-white text-[#C8747D] text-xs font-black rounded-full px-2 py-0.5 min-w-[20px] text-center shadow-xs">
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="hidden lg:inline text-xs bg-black/10 px-2 py-0.5 rounded-md font-mono text-white">
                {formatPrice(cartTotal)}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A88C90]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en el catálogo..."
            className="w-full pl-10 pr-10 py-2 bg-[#FDF6F0] border border-[#E8D5CD] rounded-2xl text-xs text-[#3D2B2E] placeholder-[#A88C90] focus:outline-none focus:border-[#C8747D]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A88C90] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
