import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider.jsx';
import { CurrencyProvider } from './providers/CurrencyProvider.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Roles from './pages/Roles.jsx';
import Charges from './pages/Charges.jsx';
import BusinessRules from './pages/BusinessRules.jsx';
import TransactionTypes from './pages/TransactionTypes.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/charges" element={<Charges />} />
            <Route path="/business-rules" element={<BusinessRules />} />
            <Route path="/transaction-types" element={<TransactionTypes />} />
          </Routes>
        </Layout>
      </CurrencyProvider>
    </ThemeProvider>
  );
}


