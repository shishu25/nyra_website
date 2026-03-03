import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useProducts } from '../../context/ProductContext';
import NyraImage from '../../assets/Nyra.png';
import './HeroBanner.css';

export default function HeroBanner() {
  const { products } = useProducts();
  const totalDresses = products.length;

  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-badge">✨ Premium Collection 2026</span>
        <h1 className="hero-title">
          Discover Your <br />
          <span className="hero-highlight">Perfect Dress</span>
        </h1>
        <p className="hero-subtitle">
          Elegance meets comfort. Browse our handpicked collection of stunning 
          ladies&apos; dresses for every occasion — from casual to couture.
        </p>

        {/* Featured Static Image */}
        <div className="hero-featured-image">
          <div className="hero-image-glow" />
          <img src={NyraImage} alt="NYRA Collection" className="hero-nyra-img" />
        </div>

        <div className="hero-actions">
          <Link to="/collection" className="hero-btn primary">
            Browse Collection
            <FiArrowRight />
          </Link>
          <Link to="/collection" className="hero-btn secondary">
            View All Dresses
            <FiArrowRight />
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">{totalDresses}</span>
            <span className="stat-label">Dresses</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Quality</span>
          </div>
        </div>
      </div>
    </section>
  );
}
