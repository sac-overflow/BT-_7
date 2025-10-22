import React, { createContext, useContext, useMemo, useState } from 'react';

const CurrencyContext = createContext(null);

const DEFAULT_RATES = {
  INR: { symbol: '₹', code: 'INR', rate: 1, name: 'Indian Rupee' },
  USD: { symbol: '$', code: 'USD', rate: 83.5, name: 'US Dollar' },
  JPY: { symbol: '¥', code: 'JPY', rate: 0.56, name: 'Japanese Yen' }
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('INR');
  const [rates] = useState(DEFAULT_RATES);

  const convert = (amount, from = 'INR', to = currency) => {
    if (from === to) return amount;
    const fromRate = rates[from]?.rate || 1;
    const toRate = rates[to]?.rate || 1;
    return (amount / fromRate) * toRate;
  };

  const format = (amount, cur = currency) => {
    const info = rates[cur];
    const converted = convert(amount, 'INR', cur);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: cur,
      minimumFractionDigits: cur === 'JPY' ? 0 : 2,
      maximumFractionDigits: cur === 'JPY' ? 0 : 2
    }).format(converted).replace(cur, info.symbol);
  };

  const value = useMemo(() => ({ currency, setCurrency, rates, convert, format, symbol: rates[currency].symbol }), [currency, rates]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}


