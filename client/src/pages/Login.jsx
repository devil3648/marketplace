import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'seller' ? '/seller' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-intro">
          <span className="auth-label">WELCOME BACK</span>
          <h1>Good to<br />see you.</h1>
          <p>
            Sign in to continue shopping or manage your products
            as a seller.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Login</h2>
            <p>Enter your account details.</p>
          </div>

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </label>

            <button className="auth-submit" type="submit">
              Login
            </button>
          </form>

          <p className="auth-footer">
            No account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

