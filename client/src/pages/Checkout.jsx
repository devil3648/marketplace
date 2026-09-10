
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Checkout.css';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setError('');
    setLoading(true);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
      };

      const { data } = await api.post('/orders/checkout', payload);
      const { razorpayOrder, keyId } = data;

      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Marketplace',
        description: 'Order payment',
        order_id: razorpayOrder.id,
        prefill: {
          name: user?.name,
          email: user?.email,
        },

        handler: async (response) => {
          try {
            await api.post('/orders/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            clearCart();
            navigate('/orders');
          } catch (err) {
            setError('Payment verification failed');
          }
        },

        modal: {
          ondismiss: () => setLoading(false),
        },

        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Checkout failed'
      );
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <span className="checkout-label">CHECKOUT</span>
          <h1>Your cart is empty.</h1>
          <p>Add some products before proceeding to checkout.</p>

          <button
            className="checkout-browse-button"
            onClick={() => navigate('/')}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <span className="checkout-label">CHECKOUT</span>
        <h1>Complete your order.</h1>
        <p>Review your order and proceed with secure payment.</p>
      </div>

      {error && (
        <p className="auth-error">{error}</p>
      )}

      <div className="checkout-layout">
        <div className="checkout-details">
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span>01</span>
              <div>
                <h2>Customer</h2>
                <p>Your account details</p>
              </div>
            </div>

            <div className="customer-card">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </section>

          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span>02</span>
              <div>
                <h2>Order Items</h2>
                <p>Products you're purchasing</p>
              </div>
            </div>

            <div className="checkout-items">
              {items.map(({ product, quantity }) => (
                <div className="checkout-item" key={product._id}>
                  <div className="checkout-item-image">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                      />
                    ) : (
                      'No image'
                    )}
                  </div>

                  <div className="checkout-item-info">
                    <h3>{product.title}</h3>
                    <span>
                      ₹{product.price} × {quantity}
                    </span>
                  </div>

                  <strong>
                    ₹{product.price * quantity}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="checkout-summary">
          <span className="summary-label">SUMMARY</span>
          <h2>Order Summary</h2>

          <div className="checkout-summary-row">
            <span>Items</span>
            <span>{items.length}</span>
          </div>

          <div className="checkout-summary-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          <button
            className="payment-button"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>

          <button
            className="back-to-cart"
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </button>
        </aside>
      </div>
    </div>
  );
}

