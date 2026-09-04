import React, { useState, useEffect } from 'react';
import { STORE_NAME } from './lib/config';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { SidebarMenu } from './components/SidebarMenu';
import { HeroBanner } from './components/HeroBanner';
import { CategoryPills } from './components/CategoryPills';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { NotificationToast } from './components/NotificationToast';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { Store, ShieldCheck, Heart, MessageCircle } from 'lucide-react';

const MainAppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewAdmin, setViewAdmin] = useState(false);
  const { isAdminLoggedIn } = useAuth();

  useEffect(() => {
    document.title = selectedProduct 
      ? `${selectedProduct.title} - ${STORE_NAME}`
      : `${STORE_NAME} - Tienda Multirrubro`;
  }, [selectedProduct]);

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewAdmin) {
    if (!isAdminLoggedIn) {
      return <AdminLogin onClose={() => setViewAdmin(false)} />;
    }
    return <AdminLayout onCloseAdmin={() => setViewAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#3D2B2E] flex flex-col justify-between font-sans selection:bg-[#E8A5AC] selection:text-white">
      
      <div>
        {/* Top Navbar */}
        <Navbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAdmin={() => setViewAdmin(true)}
        />

        {selectedProduct ? (
          /* Dedicated Full Product Detail Page */
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          /* Catalog View */
          <>
            <HeroBanner />
            <CategoryPills />
            <main>
              <ProductGrid onSelectProduct={handleSelectProduct} />
            </main>
          </>
        )}
      </div>

      {/* Slide-over Drawers & Modals */}
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenAdmin={() => setViewAdmin(true)}
      />

      <CartDrawer />
      <WhatsAppButton />
      <NotificationToast />

      {/* Footer */}
      <footer className="bg-[#FFFDF9] border-t border-[#F0E2DC] pt-12 pb-8 text-[#7A6266]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#F0E2DC]">
            
            {/* Brand Column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E8A5AC] to-[#C8747D] flex items-center justify-center text-white font-bold shadow-xs">
                  <Store className="w-5 h-5" />
                </div>
                <span className="font-serif font-bold text-xl text-[#3D2B2E]">
                  {STORE_NAME}
                </span>
              </div>
              <p className="text-xs text-[#7A6266] leading-relaxed max-w-sm">
                Tu boutique multirrubro favorita. Ropa urbana de tendencia, perfumería importada, juguetes y accesorios seleccionados especialmente para vos.
              </p>
            </div>

            {/* Rubros links */}
            <div>
              <h4 className="font-serif font-bold text-xs text-[#3D2B2E] uppercase tracking-wider mb-3">
                Rubros Destacados
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-[#C8747D] transition-colors">👕 Ropa & Moda</a></li>
                <li><a href="#" className="hover:text-[#C8747D] transition-colors">🧪 Perfumes & Fragancias</a></li>
                <li><a href="#" className="hover:text-[#C8747D] transition-colors">🧸 Juguetes & Juegos</a></li>
                <li><a href="#" className="hover:text-[#C8747D] transition-colors">📱 Electrónica & Accesorios</a></li>
              </ul>
            </div>

            {/* Contact & Admin */}
            <div>
              <h4 className="font-serif font-bold text-xs text-[#3D2B2E] uppercase tracking-wider mb-3">
                Atención Directa
              </h4>
              <div className="space-y-2 text-xs">
                <a
                  href="https://wa.me/5493863434888?text=Hola,%20tengo%20una%20consulta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#2D6A3B] hover:underline font-semibold"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Oficial
                </a>
                <button
                  onClick={() => setViewAdmin(true)}
                  className="flex items-center gap-2 text-[#C8747D] hover:underline pt-2 font-semibold"
                >
                  <ShieldCheck className="w-4 h-4" /> Panel del Emprendedor
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E8286] gap-4">
            <p>© {new Date().getFullYear()} {STORE_NAME} - Todos los derechos reservados.</p>
            <p className="flex items-center gap-1">
              Diseñado con <Heart className="w-3.5 h-3.5 text-[#C8747D] fill-[#C8747D]" /> para emprendedoras.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
