import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { useCurrency } from '../providers/CurrencyProvider.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { format } = useCurrency();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    
    api.get('/products')
      .then((data) => {
        if (mounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setProducts(sampleProducts());
          setError(err.message);
          setLoading(false);
        }
      });
    
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => products.filter(p =>
    (!search || p.productName?.toLowerCase().includes(search.toLowerCase()) || p.productCode?.toLowerCase().includes(search.toLowerCase())) &&
    (!category || p.productType === category) &&
    (!status || p.status === status)
  ), [products, search, category, status]);

  if (loading) {
    return (
      <div id="products" className="page active">
        <div className="page-header">
          <h2>Products Management</h2>
          <p>Loading products...</p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div id="products" className="page active">
      <div className="page-header">
        <h2>Products Management</h2>
        <p>Manage your product catalog and pricing</p>
        {error && <div style={{ color: '#dc3545', marginBottom: '1rem' }}>Warning: {error}</div>}
        <div className="page-actions">
          <div className="search-container">
            <input className="search-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <i className="fas fa-search search-icon"></i>
          </div>
          <div className="filter-container">
            <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="FD">Fixed Deposit</option>
              <option value="SAVINGS">Savings</option>
              <option value="CURRENT">Current</option>
              <option value="LOAN">Loan</option>
              <option value="INSURANCE">Insurance</option>
            </select>
            <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <button className="btn btn-primary"><i className="fas fa-plus"></i> Add Product</button>
        </div>
      </div>

      <div className="products-summary">
        <div className="summary-card"><i className="fas fa-box"></i><div className="summary-content"><span className="summary-number">{products.length}</span><span className="summary-label">Total Products</span></div></div>
        <div className="summary-card"><i className="fas fa-check-circle"></i><div className="summary-content"><span className="summary-number">{products.filter(p => p.status === 'ACTIVE').length}</span><span className="summary-label">Active</span></div></div>
        <div className="summary-card"><i className="fas fa-rupee-sign"></i><div className="summary-content"><span className="summary-number">{format(2450)}</span><span className="summary-label">Avg Price</span></div></div>
      </div>

      <div className="data-table-container">
        <div className="table-header">
          <h3>Products List</h3>
          <div className="table-actions">
            <button className="btn btn-sm btn-secondary"><i className="fas fa-download"></i> Export</button>
            <button className="btn btn-sm btn-primary" onClick={() => window.location.reload()}><i className="fas fa-sync-alt"></i> Refresh</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.productId}>
                  <td><input type="checkbox" /></td>
                  <td>{p.productId}</td>
                  <td><div className="product-name"><strong>{p.productName}</strong><small className="product-code">{p.productCode}</small></div></td>
                  <td><span className="status-badge status-active">{p.productType}</span></td>
                  <td className="price-cell">-</td>
                  <td><span className={`status-badge ${p.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>{p.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-primary btn-icon" title="Edit"><i className="fas fa-edit"></i></button>
                      <button className="btn btn-sm btn-info btn-icon" title="View"><i className="fas fa-eye"></i></button>
                      <button className="btn btn-sm btn-danger btn-icon" title="Delete"><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function sampleProducts() {
  return [
    { productId: 1, productCode: 'FD001', productName: 'Premium FD', productType: 'FD', status: 'ACTIVE' },
    { productId: 2, productCode: 'FD002', productName: 'TaxShield FD', productType: 'FD', status: 'ACTIVE' },
    { productId: 3, productCode: 'FD003', productName: 'FlexiGain FD', productType: 'FD', status: 'ACTIVE' },
    { productId: 4, productCode: 'FD004', productName: 'StepUp FD', productType: 'FD', status: 'ACTIVE' },
    { productId: 5, productCode: 'FD005', productName: 'GlobalConnect FD', productType: 'FD', status: 'ACTIVE' },
    { productId: 6, productCode: 'SAV001', productName: 'Premium Savings', productType: 'SAVINGS', status: 'INACTIVE' }
  ];
}


