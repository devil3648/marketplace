
import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then(({ data }) => setOrders(data));
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <span className="orders-label">PURCHASE HISTORY</span>
        <h1>My Orders</h1>
        <p>Track your previous purchases and order status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h1>No orders yet.</h1>
          <p>Your completed purchases will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-top">
                <div>
                  <span className="order-number">ORDER ID</span>
                  <h2>{order._id}</h2>
                </div>

                <span
                  className={`order-status ${
                    order.status?.toLowerCase() || ''
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div className="order-item" key={idx}>
                    <span>
                      {item.product?.title || 'Product'}
                    </span>

                    <span>
                      × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-bottom">
                <span>Total</span>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

