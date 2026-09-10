import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });

  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      navigate(user.role === 'seller' ? '/seller' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        <div className="auth-intro">
          <span className="auth-label">GET STARTED</span>

          <h1>Join the<br />marketplace.</h1>

          <p>
            Create an account to start shopping or sell your
            products to customers.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Enter your details to get started.</p>
          </div>

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </label>

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
                placeholder="Create a password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </label>

            <div className="role-selection">
              <span className="role-label">I am a:</span>

              <div className="role-options">
                <button
                  type="button"
                  className={`role-option ${
                    form.role === 'client' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setForm({ ...form, role: 'client' })
                  }
                >
                  <strong>Client</strong>
                  <span>Buy products</span>
                </button>

                <button
                  type="button"
                  className={`role-option ${
                    form.role === 'seller' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setForm({ ...form, role: 'seller' })
                  }
                >
                  <strong>Seller</strong>
                  <span>Sell products</span>
                </button>
              </div>
            </div>

            <button className="auth-submit" type="submit">
              Create Account
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

