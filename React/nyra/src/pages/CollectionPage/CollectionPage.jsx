import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { useProducts } from '../../context/ProductContext';
import './CollectionPage.css';

export default function CollectionPage() {
  const { getAvailableProducts, getCategories, isLoading } = useProducts();

  return (
    <div className="collection-page">
      <div className="collection-hero">
        <h1>Our Collection</h1>
        <p>Browse our complete range of stunning dresses</p>
      </div>
      <ProductGrid
        products={getAvailableProducts()}
        categories={getCategories()}
        isLoading={isLoading}
      />
    </div>
  );
}
