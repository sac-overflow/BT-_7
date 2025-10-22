import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function TransactionTypes() {
  const [types, setTypes] = useState([]);
  useEffect(() => {
    let mounted = true;
    api.get('/transaction-types').then((data) => mounted && setTypes(data)).catch(() => setTypes(sampleTypes()));
    return () => { mounted = false; };
  }, []);

  return (
    <div id="transaction-types" className="page active">
      <div className="page-header">
        <h2>Transaction Types</h2>
        <p>Manage different transaction categories</p>
        <button className="btn btn-primary"><i className="fas fa-plus"></i> Add Type</button>
      </div>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Type Name</th><th>Description</th><th>Category</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map(t => (
              <tr key={t.txnTypeId}>
                <td>{t.txnTypeId}</td>
                <td><strong>{t.txnName}</strong></td>
                <td>{t.description}</td>
                <td><span className="status-badge status-active">{t.category}</span></td>
                <td><span className={`status-badge ${t.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>{t.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-primary btn-icon" title="Edit"><i className="fas fa-edit"></i></button>
                    <button className="btn btn-sm btn-danger btn-icon" title="Delete"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function sampleTypes() {
  return [
    { txnTypeId: 1, txnName: 'Credit Card', description: 'Credit card payments', category: 'PAYMENT', status: 'ACTIVE' },
    { txnTypeId: 2, txnName: 'Bank Transfer', description: 'Direct bank transfers', category: 'PAYMENT', status: 'ACTIVE' },
    { txnTypeId: 3, txnName: 'Refund', description: 'Payment refunds', category: 'ADJUSTMENT', status: 'ACTIVE' },
    { txnTypeId: 4, txnName: 'Chargeback', description: 'Disputed transactions', category: 'ADJUSTMENT', status: 'ACTIVE' }
  ];
}


