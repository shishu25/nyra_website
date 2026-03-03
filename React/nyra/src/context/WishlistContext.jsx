import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('nyra_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nyra_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      if (prev.some(item => item.id === product.id)) return prev;
      return [...prev, {
        id: product.id,
        name: product.name,
        oldPrice: product.oldPrice ?? product.price ?? 0,
        newPrice: product.newPrice ?? product.price ?? 0,
        image: product.images?.[0] ?? product.image ?? '',
        category: product.category
      }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => String(item.id) !== String(productId)));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => String(item.id) === String(productId));
  };

  const clearWishlist = () => setWishlistItems([]);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
