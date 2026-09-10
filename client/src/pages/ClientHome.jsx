import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import '../styles/ClientHome.css';

export default function ClientHome() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async (query = '') => {
    setLoading(true);
    const { data } = await api.get('/products', {
      params: query ? { search: query } : {},
    });
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(search);
  };

  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-label">MARKETPLACE</span>
          <h1>Find what<br />you need.</h1>
          <p>
            Discover products from independent sellers and find
            something worth taking home.
          </p>
          <a href="#products" className="hero-button">
            Browse Products
          </a>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="products-header">
          <div>
            <span className="section-label">COLLECTION</span>
            <h2>Browse Products</h2>
          </div>

          <form className="search-box" onSubmit={handleSearch}>
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <div className="empty-products">
            <h3>No products found</h3>
            <p>Try searching for something else.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

