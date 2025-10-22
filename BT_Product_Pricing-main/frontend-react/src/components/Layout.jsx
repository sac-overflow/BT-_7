import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider.jsx';
import { useCurrency } from '../providers/CurrencyProvider.jsx';

export default function Layout({ children }) {
  const { theme, toggle } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container">
      <nav className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="credexa-logo">
              <svg viewBox="0 0 100 100" className="logo-icon">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#4FC3F7', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#29B6F6', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path d="M20 20 Q50 10 80 20 L80 80 Q50 90 20 80 Z" fill="url(#logoGradient)" opacity="0.9"/>
                <rect x="35" y="45" width="4" height="15" fill="white" rx="2"/>
                <rect x="45" y="40" width="4" height="20" fill="white" rx="2"/>
                <rect x="55" y="35" width="4" height="25" fill="white" rx="2"/>
                <circle cx="25" cy="30" r="3" fill="white" opacity="0.7"/>
                <circle cx="75" cy="70" r="3" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <span className="brand-name">Credexa</span>
          </div>
          <h1 className="app-title">Product Pricing</h1>
        </div>

        <ul className="nav-menu">
          <li className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <i className="fas fa-chart-bar"></i>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={`nav-item ${isActive('/products') ? 'active' : ''}`}>
            <i className="fas fa-box"></i>
            <Link to="/products">Products</Link>
          </li>
          <li className={`nav-item ${isActive('/roles') ? 'active' : ''}`}>
            <i className="fas fa-users"></i>
            <Link to="/roles">Roles</Link>
          </li>
          <li className={`nav-item ${isActive('/charges') ? 'active' : ''}`}>
            <i className="fas fa-money-bill-wave"></i>
            <Link to="/charges">Charges</Link>
          </li>
          <li className={`nav-item ${isActive('/business-rules') ? 'active' : ''}`}>
            <i className="fas fa-clipboard-list"></i>
            <Link to="/business-rules">Business Rules</Link>
          </li>
          <li className={`nav-item ${isActive('/transaction-types') ? 'active' : ''}`}>
            <i className="fas fa-credit-card"></i>
            <Link to="/transaction-types">Transaction Types</Link>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <i className="fas fa-chevron-right"></i>
              <span className="breadcrumb-item active">{location.pathname.replace('/', '') || 'dashboard'}</span>
            </div>
          </div>
          <div className="header-right">
            <button className="theme-toggle-btn" title="Toggle theme" aria-label="Toggle theme" onClick={toggle}>
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <div className="currency-selector">
              <select className="currency-dropdown" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="JPY">¥ JPY</option>
              </select>
            </div>
            <div className="user-profile">
              <div className="profile-avatar"><i className="fas fa-user"></i></div>
              <span className="profile-name">Admin User</span>
            </div>
          </div>
        </header>
        <div className="content-wrapper">{children}</div>
      </main>
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
}


