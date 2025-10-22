import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useCurrency } from '../providers/CurrencyProvider.jsx';

export default function Charges() {
  const [charges, setCharges] = useState([]);
  const { format } = useCurrency();

  useEffect(() => {
    let mounted = true;
    api.get('/charges').then((data) => mounted && setCharges(data)).catch(() => setCharges(sampleCharges()));
    return () => { mounted = false; };
  }, []);

  return (
    <div id="charges" className="page active">
      <div className="page-header">
        <h2>Charges Management</h2>
        <p>Configure pricing charges and fees</p>
        <button className="btn btn-primary"><i className="fas fa-plus"></i> Add Charge</button>
      </div>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Charge Name</th><th>Type</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charges.map(c => (
              <tr key={c.chargeId}>
                <td>{c.chargeId}</td>
                <td><strong>{c.chargeName}</strong></td>
                <td><span className="status-badge status-active">{c.chargeType}</span></td>
                <td className="price-cell">{format(Number(c.chargeAmount || 0))}</td>
                <td><span className={`status-badge ${c.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>{c.status}</span></td>
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

function sampleCharges() {
  return [
    { chargeId: 1, chargeName: 'Processing Fee', chargeType: 'PERCENTAGE', chargeAmount: 2.5, status: 'ACTIVE' },
    { chargeId: 2, chargeName: 'Fixed Fee', chargeType: 'FIXED', chargeAmount: 0.5, status: 'ACTIVE' }
  ];
}


