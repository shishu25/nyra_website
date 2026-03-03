import { Link } from 'react-router-dom';
import { FiEye, FiShoppingCart, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { id, name, oldPrice, newPrice, images, status, category } = product;
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Backward compat: support old 'price' and 'image' fields
  const displayNewPrice = newPrice ?? product.price ?? 0;
  const displayOldPrice = oldPrice ?? null;
  const displayImage = images?.[0] ?? product.image ?? '';

  // Don't render if product has no valid image or name
  if (!name || !displayImage) return null;

  const inCart = isInCart(id);
  const inWishlist = isInWishlist(id);
  const isAvailable = status === 'available';

  const statusLabel = {
    available: 'Available',
    pending: 'Reserved',
    confirmed: 'Sold Out'
  };

  const statusClass = {
    available: 'status-available',
    pending: 'status-pending',
    confirmed: 'status-confirmed'
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart && isAvailable) {
      addToCart(product);
      toast.success(`Added to cart 🛒`, { duration: 2000 });
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id);
      toast.success('Removed from wishlist', { duration: 2000 });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist ❤️', { duration: 2000 });
    }
  };

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <img
          src={displayImage}
          alt={name}
          className="card-image"
          loading="lazy"
        />
        <span className={`card-status ${statusClass[status]}`}>
          {statusLabel[status]}
        </span>
        <span className="card-category">{category}</span>
        {/* Quick action overlays */}
        <div className="card-quick-actions">
          <button
            className={`card-quick-btn ${inWishlist ? 'active-wish' : ''}`}
            onClick={handleWishlistClick}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FiHeart />
          </button>
          {isAvailable && (
            <button
              className={`card-quick-btn ${inCart ? 'active-cart' : ''}`}
              onClick={handleCartClick}
              title={inCart ? 'In Cart' : 'Add to Cart'}
              disabled={inCart}
            >
              <FiShoppingCart />
            </button>
          )}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <div className="card-footer">
          <div className="card-pricing">
            {displayOldPrice && displayOldPrice > displayNewPrice && (
              <span className="card-old-price">৳{displayOldPrice.toLocaleString()}</span>
            )}
            <span className="card-price">৳{displayNewPrice.toLocaleString()}</span>
          </div>
          <Link to={`/product/${id}`} className="card-btn">
            <FiEye />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
