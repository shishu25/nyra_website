import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingBag, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FiShoppingBag className="logo-icon" />
          <span className="logo-text">NYRA</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/"
              className={isActive('/') ? 'nav-link active' : 'nav-link'}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/collection"
              className={isActive('/collection') ? 'nav-link active' : 'nav-link'}
              onClick={() => setMenuOpen(false)}
            >
              Collection
            </Link>
          </li>
        </ul>

        {/* Cart & Wishlist Icons */}
        <div className="nav-icons">
          <Link
            to="/wishlist"
            className={`nav-icon-btn ${isActive('/wishlist') ? 'active' : ''}`}
            aria-label="Wishlist"
          >
            <FiHeart />
            {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
          </Link>
          <Link
            to="/cart"
            className={`nav-icon-btn ${isActive('/cart') ? 'active' : ''}`}
            aria-label="Cart"
          >
            <FiShoppingCart />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
