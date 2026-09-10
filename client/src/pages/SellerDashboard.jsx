
import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/SellerDashboard.css';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const loadMyProducts = async () => {
    const { data } = await api.get('/products/seller/mine');
    setProducts(data);
  };

  useEffect(() => {
    loadMyProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const fd = new FormData();

      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('stock', form.stock);

      files.forEach((f) => fd.append('images', f));

      await api.post('/products', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setForm({
        title: '',
        description: '',
        price: '',
        stock: '',
      });

      setFiles([]);
      loadMyProducts();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create product'
      );
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    loadMyProducts();
  };

  return (
    <div className="seller-page">
      <div className="seller-header">
        <span className="seller-label">SELLER AREA</span>
        <h1>Seller Dashboard</h1>
        <p>Manage your products and add new items to the marketplace.</p>
      </div>

      <div className="seller-layout">
        <div className="seller-form-card">
          <div className="seller-section-header">
            <span className="section-number">01</span>
            <div>
              <h2>Add Product</h2>
              <p>List a new product for customers.</p>
            </div>
          </div>

          {error && (
            <p className="seller-error">{error}</p>
          )}

          <form className="seller-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                placeholder="Product title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </label>

            <label>
              Description
              <textarea
                placeholder="Describe your product"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <div className="seller-form-row">
              <label>
                Price
                <div className="input-prefix">
                  <span>₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </div>
              </label>

              <label>
                Stock
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  required
                />
              </label>
            </div>

            <label>
              Product Images
              <div className="file-input-wrapper">
                <span>
                  {files.length > 0
                    ? `${files.length} image(s) selected`
                    : 'Click to select images'}
                </span>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setFiles(Array.from(e.target.files))
                  }
                />
              </div>
            </label>

            <button className="seller-submit" type="submit">
              Add Product
            </button>
          </form>
        </div>

        <div className="seller-products">
          <div className="seller-section-header">
            <span className="section-number">02</span>
            <div>
              <h2>Your Products</h2>
              <p>Products currently listed by you.</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="seller-empty">
              <h3>No products yet</h3>
              <p>Add your first product using the form.</p>
            </div>
          ) : (
            <div className="seller-product-list">
              {products.map((p) => (
                <div className="seller-product" key={p._id}>
                  <div className="seller-product-image">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} />
                    ) : (
                      'No image'
                    )}
                  </div>

                  <div className="seller-product-info">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>

                    <div className="seller-product-meta">
                      <strong>₹{p.price}</strong>
                      <span>{p.stock} in stock</span>
                    </div>
                  </div>

                  <button
                    className="delete-product"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

