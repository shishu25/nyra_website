import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { useProducts } from '../../context/ProductContext';
import './HomePage.css';

export default function HomePage() {
  const { getAvailableProducts, getCategories } = useProducts();

  return (
    <div className="home-page">
      <HeroBanner />
      <ProductGrid
        products={getAvailableProducts()}
        categories={getCategories()}
        title="Our Collection"
        subtitle="Handpicked dresses curated for elegance and style"
      />

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">👗</div>
            <h3>Premium Quality</h3>
            <p>Every dress is handpicked for quality fabric and craftsmanship</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📞</div>
            <h3>Easy Booking</h3>
            <p>Reserve your favorite dress with just your phone number</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Home Delivery</h3>
            <p>We deliver right to your doorstep across the city</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Exclusive Designs</h3>
            <p>Unique designs you won&apos;t find anywhere else</p>
          </div>
        </div>
      </section>
    </div>
  );
}
