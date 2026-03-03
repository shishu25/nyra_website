import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useBookings } from '../../context/BookingContext';
import CheckoutModal from '../../components/CheckoutModal/CheckoutModal';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const { getProduct, updateProductStatus } = useProducts();
  const { addBooking } = useBookings();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleRemove = (item) => {
    removeFromCart(item.id);
    toast.success(`Removed "${item.name}" from cart`);
  };

  // Filter out items whose product is no longer available
  const availableItems = cartItems.filter(item => {
    const product = getProduct(item.id);
    return product && product.status === 'available';
  });

  const unavailableItems = cartItems.filter(item => {
    const product = getProduct(item.id);
    return !product || product.status !== 'available';
  });

  const handleCheckoutComplete = (contactInfo) => {
    // Create bookings for each available item
    availableItems.forEach(item => {
      addBooking({
        productId: item.id,
        productName: item.name,
        productPrice: item.newPrice,
        productImage: item.image,
        customerName: contactInfo.customerName,
        phone: contactInfo.phone,
        email: contactInfo.email || '',
        address: contactInfo.address
      });
      updateProductStatus(item.id, 'pending');
    });

    clearCart();
    setShowCheckout(false);
    toast.success(
      'Your order has been placed! The admin will contact you to confirm the ordered products.',
      { duration: 5000 }
    );
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <Link to="/collection" className="cart-back">
          <FiArrowLeft /> Continue Shopping
        </Link>

        <div className="cart-header">
          <FiShoppingCart className="cart-header-icon" />
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <FiShoppingCart size={56} />
            <h2>Your cart is empty</h2>
            <p>Browse our collection and add some beautiful dresses!</p>
            <Link to="/collection" className="cart-shop-btn">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {/* Unavailable warning */}
              {unavailableItems.length > 0 && (
                <div className="cart-unavailable-notice">
                  <p>⚠️ {unavailableItems.length} item(s) became unavailable and will not be included in checkout.</p>
                </div>
              )}

              {cartItems.map(item => {
                const product = getProduct(item.id);
                const isUnavailable = !product || product.status !== 'available';
                return (
                  <div key={item.id} className={`cart-item ${isUnavailable ? 'unavailable' : ''}`}>
                    <Link to={`/product/${item.id}`} className="cart-item-img-link">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                    </Link>
                    <div className="cart-item-info">
                      <span className="cart-item-cat">{item.category}</span>
                      <Link to={`/product/${item.id}`} className="cart-item-name">
                        {item.name}
                      </Link>
                      {isUnavailable && (
                        <span className="cart-item-unavailable-tag">Unavailable</span>
                      )}
                      <div className="cart-item-pricing">
                        {item.oldPrice > item.newPrice && (
                          <span className="cart-item-old">৳{item.oldPrice.toLocaleString()}</span>
                        )}
                        <span className="cart-item-new">৳{item.newPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <button className="cart-item-remove" onClick={() => handleRemove(item)}>
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({availableItems.length})</span>
                <span>৳{availableItems.reduce((s, i) => s + i.newPrice, 0).toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="summary-free">Free</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>৳{availableItems.reduce((s, i) => s + i.newPrice, 0).toLocaleString()}</span>
              </div>
              <button
                className="cart-checkout-btn"
                disabled={availableItems.length === 0}
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
              <p className="cart-note">No payment required. Pay on delivery.</p>
            </div>
          </div>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal
          items={availableItems}
          onClose={() => setShowCheckout(false)}
          onComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
}
