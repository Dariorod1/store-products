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
      // 1. Try fetching categories from Supabase
      const { data: dbCategories, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      // 2. Try fetching products from Supabase
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!catErr && dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
      }

      if (!prodErr && dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
        setIsUsingSupabase(true);
      } else {
        // Fallback to rich mock data if empty or error
        console.log('Using mock products fallback');
        setProducts(MOCK_PRODUCTS);
        setIsUsingSupabase(false);
      }
    } catch (err) {
      console.warn('Error connecting to Supabase, using local fallback:', err);
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

  // CRUD Operations for Admin Panel
  const addProduct = async (newProductData) => {
    const newProd = {
      ...newProductData,
      id: isUsingSupabase ? undefined : `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isUsingSupabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([newProd])
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          setProducts((prev) => [data[0], ...prev]);
          return { success: true, data: data[0] };
        }
      } catch (err) {
        console.error('Error saving to Supabase:', err.message);
        // Local update fallback
        setProducts((prev) => [{ ...newProd, id: `prod-${Date.now()}` }, ...prev]);
        return { success: true, warning: 'Guardado localmente (ejecuta el script SQL para guardar en Supabase)' };
      }
    } else {
      setProducts((prev) => [{ ...newProd, id: `prod-${Date.now()}` }, ...prev]);
      return { success: true };
    }
  };

  const updateProduct = async (id, updatedFields) => {
    if (isUsingSupabase && !id.toString().startsWith('prod-')) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ ...updatedFields, updated_at: new Date().toISOString() })
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
