import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './WishlistPage.css';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
    toast.success(`"${item.name}" moved to cart 🛒`);
  };

  const handleRemove = (item) => {
    removeFromWishlist(item.id);
    toast.success(`Removed from wishlist`);
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <Link to="/collection" className="wishlist-back">
          <FiArrowLeft /> Continue Shopping
        </Link>

        <div className="wishlist-header">
          <FiHeart className="wishlist-header-icon" />
          <h1>My Wishlist</h1>
          <p>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <FiHeart size={56} />
            <h2>Your wishlist is empty</h2>
            <p>Save your favourite dresses here to come back to later.</p>
            <Link to="/collection" className="wishlist-shop-btn">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-card">
                <Link to={`/product/${item.id}`} className="wishlist-card-img-link">
                  <img src={item.image} alt={item.name} className="wishlist-card-img" />
                </Link>
                <div className="wishlist-card-body">
                  <span className="wishlist-card-cat">{item.category}</span>
                  <Link to={`/product/${item.id}`} className="wishlist-card-name">
                    {item.name}
                  </Link>
                  <div className="wishlist-card-pricing">
                    {item.oldPrice > item.newPrice && (
                      <span className="wishlist-old">৳{item.oldPrice.toLocaleString()}</span>
                    )}
                    <span className="wishlist-new">৳{item.newPrice.toLocaleString()}</span>
                  </div>
                  <div className="wishlist-card-actions">
                    <button
                      className="wishlist-move-btn"
                      onClick={() => handleMoveToCart(item)}
                      disabled={isInCart(item.id)}
                    >
                      <FiShoppingCart />
                      {isInCart(item.id) ? 'In Cart' : 'Move to Cart'}
                    </button>
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => handleRemove(item)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
