
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

export default function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    total,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <span className="cart-label">YOUR CART</span>
          <h1>Nothing here<br />yet.</h1>
          <p>Your cart is empty. Browse the marketplace to find something you like.</p>
          <Link to="/" className="cart-browse-button">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <span className="cart-label">SHOPPING CART</span>
        <h1>Your Cart</h1>
        <p>Review your items before checkout.</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ product, quantity }) => (
            <div className="cart-item" key={product._id}>
              <div className="cart-item-image">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                  />
                ) : (
                  'No image'
                )}
              </div>

              <div className="cart-item-info">
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <strong>₹{product.price}</strong>
              </div>

              <div className="cart-item-actions">
                <select
                  value={quantity}
                  onChange={(e) =>
                    updateQuantity(
                      product._id,
                      Number(e.target.value)
                    )
                  }
                >
                  {Array.from(
                    { length: product.stock },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option key={number} value={number}>
                      Qty {number}
                    </option>
                  ))}
                </select>

                <button
                  className="cart-remove"
                  onClick={() => removeFromCart(product._id)}
                >
                  Remove
                </button>
              </div>

              <div className="cart-item-total">
                ₹{product.price * quantity}
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <span className="summary-label">SUMMARY</span>
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{items.length}</span>
          </div>

          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <Link to="/checkout">
            <button className="checkout-button">
              Proceed to Checkout
            </button>
          </Link>

          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

