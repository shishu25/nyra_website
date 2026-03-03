import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('nyra_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nyra_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
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

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== Number(productId)));
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === Number(productId));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.length;

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.newPrice || 0), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      isInCart,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
