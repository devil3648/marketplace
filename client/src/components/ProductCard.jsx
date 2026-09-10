import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {product.images?.[0] ? (
          <img
            className="product-image"
            src={product.images[0]}
            alt={product.title}
          />
        ) : (
          <div className="product-image-placeholder">
            No image
          </div>
        )}

        {product.stock > 0 && (
          <span className="product-stock-badge">
            In stock
          </span>
        )}
      </div>

      <div className="product-content">
        <h4 className="product-title">{product.title}</h4>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">
          <div>
            <p className="product-price">₹{product.price}</p>

            <p className={`product-stock ${product.stock === 0 ? 'out' : ''}`}>
              {product.stock > 0
                ? `${product.stock} in stock`
                : 'Out of stock'}
            </p>
          </div>

          {(!user || user.role === 'client') && (
            <button
              className="add-cart-button"
              disabled={product.stock === 0}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
