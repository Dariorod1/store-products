import { 
  X, 
  Shirt, 
  Sparkles, 
  Gamepad2, 
  Headphones, 
  Home, 
  ShoppingBag, 
  Layers, 
  Star, 
  MessageCircle, 
  ShieldCheck,
  ChevronRight,
  Database,
  User
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useBackHandler } from '../hooks/useBackHandler';

const iconMap = {
  Shirt: Shirt,
  Sparkles: Sparkles,
  Gamepad2: Gamepad2,
  Headphones: Headphones,
  Home: Home,
  ShoppingBag: ShoppingBag
};

export const SidebarMenu = ({ isOpen, onClose, onOpenAdmin, onOpenAuth }) => {
  useBackHandler(isOpen, onClose);
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    featuredOnly, 
    setFeaturedOnly,
    products,
    isUsingSupabase 
  } = useProducts();

  const { user, isAdminLoggedIn } = useAuth();

  if (!isOpen) return null;

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over menu panel */}
      <aside className="absolute inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-[#FFFDF9] border-r border-[#F0E2DC] text-[#3D2B2E] shadow-2xl flex flex-col justify-between animate-slideRight transition-transform duration-300">
        
        {/* Header section */}
        <div>
          <div className="p-5 border-b border-[#F0E2DC] flex items-center justify-between bg-[#FAF0EA]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F9EAE8] border border-[#F3D5D8] flex items-center justify-center text-[#C8747D]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#3D2B2E]">
                  Rubros & Categorías
                </h3>
                <p className="text-xs text-[#7A6266]">
                  Explora nuestra tienda
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-[#F0E2DC] text-[#7A6266] hover:text-[#3D2B2E] hover:bg-[#F3E2DA] transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories List */}
          <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
            
            {/* All Products */}
            <button
              onClick={() => handleSelectCategory('all')}
              className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold transition-all ${
                selectedCategory === 'all' && !featuredOnly
                  ? 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] text-white shadow-xs'
                  : 'text-[#4A3538] hover:bg-[#FDF6F0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[#C8747D]" />
                <span>Todos los Productos</span>
              </div>
              <span className="text-xs bg-[#FAF0EA] px-2 py-0.5 rounded-full font-mono text-[#7A6266]">
                {products.length}
              </span>
            </button>

            <div className="py-2 text-[11px] font-bold uppercase tracking-wider text-[#A88C90] px-3">
              Rubros Principales
            </div>

            {/* Category Items */}
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || ShoppingBag;
              const isSelected = selectedCategory === cat.slug && !featuredOnly;
              const categoryProductCount = products.filter(p => p.category_slug === cat.slug).length;

              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-medium transition-all group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#D88A92] to-[#C8747D] text-white shadow-xs font-semibold'
                      : 'text-[#4A3538] hover:bg-[#FDF6F0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-[#FAF0EA] group-hover:bg-[#F3E2DA] text-[#C8747D] ${isSelected ? 'bg-white/20 text-white' : ''}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF0EA] text-[#7A6266]'
                    }`}>
                      {categoryProductCount}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-[#A88C90] group-hover:translate-x-0.5 transition-transform ${isSelected ? 'text-white' : ''}`} />
                  </div>
                </button>
              );
            })}

            <div className="pt-4 border-t border-[#F0E2DC] my-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A88C90] px-3 mb-1">
                Filtros Rápidos
              </div>
              <button
                onClick={() => {
                  setFeaturedOnly(!featuredOnly);
                  onClose();
                }}
                className={`w-full px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs transition-all ${
                  featuredOnly
                    ? 'bg-[#FFF0E0] text-[#D97724] border border-[#FCE0C7] font-semibold'
                    : 'text-[#4A3538] hover:bg-[#FDF6F0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-[#E5A93C] fill-[#E5A93C]" />
                  <span>Productos Destacados</span>
                </div>
                <span className="text-xs text-[#D97724] font-bold">{featuredOnly ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="p-4 border-t border-[#F0E2DC] bg-[#FAF7F5] space-y-2.5">
          
          {/* Status Badge */}
          <div className="px-3 py-2 rounded-xl bg-white border border-[#F0E2DC] flex items-center justify-between text-xs text-[#7A6266]">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#C8747D]" />
              Base de Datos:
            </span>
            <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
              isUsingSupabase ? 'bg-[#EBF5ED] text-[#2D6A3B] border border-[#C2E0C8]' : 'bg-[#FFF0E0] text-[#D97724] border border-[#FCE0C7]'
            }`}>
              {isUsingSupabase ? 'Supabase Conectado' : 'Modo Demostración'}
            </span>
          </div>

          {/* Contact Support WhatsApp */}
          <a
            href="https://wa.me/5493863434888?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20productos"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#EBF5ED] hover:bg-[#DDF0E0] border border-[#C2E0C8] text-[#2D6A3B] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#2D6A3B]" />
            Contactar por WhatsApp
          </a>

          {/* User Account / Login Button */}
          <button
            onClick={() => {
              onClose();
              if (onOpenAuth) onOpenAuth();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF0EA] hover:bg-[#F3E2DA] border border-[#E8D5CD] text-[#5C4246] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <User className="w-4 h-4 text-[#C8747D]" />
            <span>{user ? `Mi Cuenta (${user.name.split(' ')[0]})` : 'Iniciar Sesión / Registrarse'}</span>
          </button>

          {/* Admin Panel Button (ONLY VISIBLE TO ADMINS) */}
          {isAdminLoggedIn && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#EBF5ED] hover:bg-[#DDF0E0] text-[#2D6A3B] border border-[#C2E0C8] text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#2D6A3B]" />
              Panel de Emprendedor
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
