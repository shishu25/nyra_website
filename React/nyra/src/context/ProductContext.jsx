import { createContext, useContext, useState, useEffect } from 'react';
import initialProducts, { CATEGORIES } from '../data/products';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nyra_products_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: if old format (has 'price' but no 'newPrice'), convert
      if (parsed.length > 0 && parsed[0].price !== undefined && parsed[0].newPrice === undefined) {
        return initialProducts;
      }
      return parsed;
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('nyra_products_v2', JSON.stringify(products));
  }, [products]);

  const getProduct = (id) => products.find(p => p.id === Number(id));

  const updateProductStatus = (id, status) => {
    setProducts(prev =>
      prev.map(p => (p.id === Number(id) ? { ...p, status } : p))
    );
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      status: product.status || 'available'
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const editProduct = (id, updates) => {
    setProducts(prev =>
      prev.map(p => (p.id === Number(id) ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== Number(id)));
  };

  const getAvailableProducts = () => products.filter(p => p.status !== 'confirmed');

  const getCategories = () => {
    const cats = [...new Set([...CATEGORIES, ...products.map(p => p.category)])];
    return ['All', ...cats];
  };

  return (
    <ProductContext.Provider value={{
      products,
      setProducts,
      getProduct,
      updateProductStatus,
      addProduct,
      editProduct,
      deleteProduct,
      getAvailableProducts,
      getCategories,
      CATEGORIES
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}

export { CATEGORIES };
