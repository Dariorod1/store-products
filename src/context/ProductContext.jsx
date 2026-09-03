import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../lib/mockData';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'newest'
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Fetch categories & products from Supabase
  const fetchProductsAndCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch categories from Supabase
      const { data: dbCategories, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      // 2. Fetch products from Supabase
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (catErr) console.warn('Error categorias:', catErr.message);
      if (prodErr) console.warn('Error productos:', prodErr.message);

      // Si Supabase responde (aunque esté vacío) usamos la DB real
      if (!prodErr) {
        setProducts(dbProducts || []);
        setIsUsingSupabase(true);
      } else {
        // Solo caemos al mock si hay un error real de conexión
        console.log('Fallback a mock products por error de conexión');
        setProducts(MOCK_PRODUCTS);
        setIsUsingSupabase(false);
      }

      if (!catErr && dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
      }

    } catch (err) {
      console.warn('Error conectando a Supabase, usando fallback local:', err);
      setProducts(MOCK_PRODUCTS);
      setCategories(MOCK_CATEGORIES);
      setIsUsingSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Registrar búsquedas de los clientes con debounce (persiste en Supabase y localStorage)
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || query.length < 2) return;

    const timer = setTimeout(async () => {
      const nowIso = new Date().toISOString();

      // 1. Guardar en localStorage (respaldo local)
      try {
        const localLogs = JSON.parse(localStorage.getItem('store_search_logs') || '[]');
        localLogs.push({ query, created_at: nowIso });
        localStorage.setItem('store_search_logs', JSON.stringify(localLogs.slice(-500)));
      } catch (e) {
        console.error('Error al guardar log de búsqueda local:', e);
      }

      // 2. Guardar en Supabase (persistencia global)
      try {
        await supabase.from('search_logs').insert([{ query, created_at: nowIso }]);
      } catch (err) {
        console.warn('Log de búsqueda solo guardado localmente:', err.message);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // CRUD Operations for Admin Panel
  const addProduct = async (newProductData) => {
    // Siempre intentamos guardar en Supabase primero
    try {
      // Extraemos category_name porque no existe como columna en la DB
      // (se obtiene desde la tabla categories via category_slug)
      const { category_name, ...rest } = newProductData;
      const payload = {
        ...rest,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      delete payload.id;

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts((prev) => [data[0], ...prev]);
        setIsUsingSupabase(true);
        return { success: true, data: data[0] };
      }
    } catch (err) {
      console.error('Error guardando en Supabase:', err.message);
      const localProd = { ...newProductData, id: `prod-${Date.now()}` };
      setProducts((prev) => [localProd, ...prev]);
      return { success: true, warning: 'Guardado localmente — revisá la conexión a Supabase' };
    }
  };



  const updateProduct = async (id, updatedFields) => {
    if (isUsingSupabase && !id.toString().startsWith('prod-')) {
      try {
        // Excluir category_name porque no existe como columna en la DB
        const { category_name, ...fieldsToUpdate } = updatedFields;
        const { data, error } = await supabase
          .from('products')
          .update({ ...fieldsToUpdate, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select();

        if (error) throw error;
      } catch (err) {
        console.error('Error updating product in Supabase:', err);
      }
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    return { success: true };
  };


  const deleteProduct = async (id) => {
    if (isUsingSupabase && !id.toString().startsWith('prod-')) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Error deleting product from Supabase:', err);
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  };

  const toggleStock = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newStock = product.stock > 0 ? 0 : 10;
    const newIsActive = newStock > 0;

    await updateProduct(id, { stock: newStock, is_active: newIsActive });
  };

  // Filtered & Sorted Products computation
  const filteredProducts = products.filter((product) => {
    // Search query check
    const matchesSearch =
      !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.tags && product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    // Category check
    const matchesCategory =
      selectedCategory === 'all' ||
      product.category_slug === selectedCategory;

    // Featured check
    const matchesFeatured = !featuredOnly || product.is_featured;

    return matchesSearch && matchesCategory && matchesFeatured;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    // Default 'featured'
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        filteredProducts,
        loading,
        error,
        isUsingSupabase,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        featuredOnly,
        setFeaturedOnly,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        refreshProducts: fetchProductsAndCategories
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};
