import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiHeart, FiAlertCircle, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductDetailsPage.css';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const product = getProduct(id);

  if (!product) {
    return (
      <div className="details-page">
        <div className="details-container not-found">
          <FiAlertCircle size={48} />
          <h2>Dress Not Found</h2>
          <p>The dress you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link to="/" className="back-link">
            <FiArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Backward compat
  const productImages = product.images || [product.image];
  const displayNewPrice = product.newPrice ?? product.price ?? 0;
  const displayOldPrice = product.oldPrice ?? null;
  const productVideo = product.video || null;

  const isAvailable = product.status === 'available';
  const isPending = product.status === 'pending';
  const isConfirmed = product.status === 'confirmed';

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`"${product.name}" added to cart 🛒`);
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist ❤️');
    }
  };

  return (
    <div className="details-page">
      <div className="details-container">
        <Link to="/collection" className="back-link">
          <FiArrowLeft /> Back to Collection
        </Link>

        <div className="details-grid">
          {/* Image Gallery */}
          <div className="details-gallery">
            <div className="gallery-main">
              {showVideo && productVideo ? (
                <video
                  src={productVideo}
                  controls
                  autoPlay
                  className="gallery-main-video"
                />
              ) : (
                <img
                  src={productImages[activeImage]}
                  alt={product.name}
                  className="gallery-main-image"
                />
              )}
              <span className={`details-status status-${product.status}`}>
                {isAvailable && 'Available'}
                {isPending && 'Reserved'}
                {isConfirmed && 'Sold Out'}
              </span>
            </div>
            {/* Thumbnails */}
            <div className="gallery-thumbs">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  className={`gallery-thumb ${!showVideo && i === activeImage ? 'active' : ''}`}
                  onClick={() => { setActiveImage(i); setShowVideo(false); }}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
              {productVideo && (
                <button
                  className={`gallery-thumb video-thumb ${showVideo ? 'active' : ''}`}
                  onClick={() => setShowVideo(true)}
                >
                  <span className="video-thumb-icon">▶</span>
                  Video
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="details-info">
            <span className="details-category">{product.category}</span>
            <h1 className="details-name">{product.name}</h1>
            
            <div className="details-pricing">
              {displayOldPrice && displayOldPrice > displayNewPrice && (
                <span className="details-old-price">৳{displayOldPrice.toLocaleString()}</span>
              )}
              <span className="details-new-price">৳{displayNewPrice.toLocaleString()}</span>
              {displayOldPrice && displayOldPrice > displayNewPrice && (
                <span className="details-discount">
                  {Math.round(((displayOldPrice - displayNewPrice) / displayOldPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="details-description">{product.description}</p>

            <div className="details-divider" />

            {/* Action Buttons */}
            <div className="details-actions">
              {isAvailable && (
                <button
                  className={`booking-btn available ${inCart ? 'in-cart' : ''}`}
                  onClick={handleAddToCart}
                  disabled={inCart}
                >
                  {inCart ? <><FiCheck /> In Cart</> : <><FiShoppingCart /> Add to Cart</>}
                </button>
              )}

              {isPending && (
                <button className="booking-btn reserved" disabled>
                  Selected by Another Customer
                </button>
              )}

              {isConfirmed && (
                <button className="booking-btn sold" disabled>
                  Out of Stock
                </button>
              )}

              <button
                className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                onClick={handleToggleWishlist}
              >
                <FiHeart />
                {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            <div className="details-extra">
              <div className="extra-item">
                <span className="extra-label">Availability</span>
                <span className={`extra-value ${product.status}`}>
                  {isAvailable ? 'In Stock' : isPending ? 'Temporarily Reserved' : 'Not Available'}
                </span>
              </div>
              <div className="extra-item">
                <span className="extra-label">Category</span>
                <span className="extra-value">{product.category}</span>
              </div>
              <div className="extra-item">
                <span className="extra-label">Booking</span>
                <span className="extra-value">No payment required</span>
              </div>
            </div>

            <a
              href={`https://wa.me/1234567890?text=Hi, I'm interested in "${product.name}" (৳${displayNewPrice.toLocaleString()})`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
