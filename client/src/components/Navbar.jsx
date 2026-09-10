import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Market<span>Place</span>
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {user?.role === 'seller' && (
          <Link to="/seller">Seller Dashboard</Link>
        )}

        {user?.role === 'client' && (
          <Link to="/cart" className="cart-link">
            Cart <span className="cart-count">{items.length}</span>
          </Link>
        )}

        {user?.role === 'client' && (
          <Link to="/orders">My Orders</Link>
        )}
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">
              {user.name} ({user.role})
            </span>

            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-login">
              Login
            </Link>

            <Link to="/register" className="navbar-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}


