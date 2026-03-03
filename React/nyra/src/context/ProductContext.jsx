import { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES } from '../data/products';

const ProductContext = createContext();

const STORAGE_KEY = 'nyra_products_v3';

/**
 * Validates that a product has all required fields to be displayed.
 * Products missing name, images, or price are filtered out on the public site.
 */
const isValidProduct = (product) => {
  if (!product) return false;
  if (!product.name || !product.name.trim()) return false;
  if (!product.newPrice && product.newPrice !== 0) return false;
  if (Number(product.newPrice) <= 0) return false;
  // Must have at least one valid image
  const images = product.images || [];
  const hasValidImage = images.some(img => img && img.trim().length > 0);
  if (!hasValidImage) return false;
  return true;
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from localStorage on mount (admin-uploaded only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        }
      }
      // Also migrate from old key if v3 is empty
      if (!saved) {
        const oldSaved = localStorage.getItem('nyra_products_v2');
        if (oldSaved) {
          const oldParsed = JSON.parse(oldSaved);
          if (Array.isArray(oldParsed)) {
            // Only keep admin-uploaded products (those with base64 images or valid data)
            const adminProducts = oldParsed.filter(p =>
              isValidProduct(p) && p.id > 1000 // admin-added products use Date.now() as ID (large numbers)
            );
            setProducts(adminProducts);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts));
          }
        }
      }
    } catch (e) {
      console.error('Failed to load products from storage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist products to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isLoading]);

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
      status: product.status || 'available',
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const editProduct = (id, updates) => {
    setProducts(prev =>
      prev.map(p => (p.id === Number(id) ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== Number(id)));
  };

  /**
   * Returns only validated, non-confirmed products for public display.
   * - Filters out confirmed (sold out) products
   * - Filters out incomplete/invalid products
   */
  const getAvailableProducts = () =>
    products.filter(p => p.status !== 'confirmed' && isValidProduct(p));

  /**
   * Returns all products (including confirmed) for admin panel.
   */
  const getAllProducts = () => products;

  const getCategories = () => {
    const cats = [...new Set([...CATEGORIES, ...products.map(p => p.category).filter(Boolean)])];
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
      getAllProducts,
      getCategories,
      isLoading,
      isValidProduct,
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
