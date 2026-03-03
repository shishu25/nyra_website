import { useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

/* ── Skeleton card shown while loading ── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-title shimmer" />
        <div className="skeleton-row">
          <div className="skeleton-line skeleton-price shimmer" />
          <div className="skeleton-line skeleton-btn shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, categories, title, subtitle, isLoading }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="product-grid-section">
      <div className="product-grid-container">
        {title && (
          <div className="section-header">
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        )}

        <div className="grid-controls">
          {categories && categories.length > 1 && (
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="search-box">
            <input
              type="text"
              placeholder="Search dresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="empty-products-state">
            <div className="empty-products-icon">👗</div>
            <h3 className="empty-products-title">
              {products.length === 0
                ? 'No Products Available Yet'
                : 'No Matching Products'}
            </h3>
            <p className="empty-products-text">
              {products.length === 0
                ? 'Our collection is being updated. Please check back soon!'
                : 'Try a different search term or category.'}
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
