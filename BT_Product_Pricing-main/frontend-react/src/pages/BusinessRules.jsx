import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function BusinessRules() {
  const [rules, setRules] = useState([]);
  useEffect(() => {
    let mounted = true;
    api.get('/business-rules').then((data) => mounted && setRules(data)).catch(() => setRules(sampleRules()));
    return () => { mounted = false; };
  }, []);

  return (
    <div id="business-rules" className="page active">
      <div className="page-header">
        <h2>Business Rules</h2>
        <p>Define pricing rules and logic</p>
        <button className="btn btn-primary"><i className="fas fa-plus"></i> Add Rule</button>
      </div>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Rule Name</th><th>Condition</th><th>Action</th><th>Priority</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(r => (
              <tr key={r.ruleId}>
                <td>{r.ruleId}</td>
                <td><strong>{r.ruleName}</strong></td>
                <td><code className="rule-condition">{r.condition}</code></td>
                <td>{r.action}</td>
                <td><span className="status-badge status-active">{r.priority}</span></td>
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

function sampleRules() {
  return [
    { ruleId: 1, ruleName: 'Volume Discount', condition: 'quantity > 100', action: 'apply 10% discount', priority: 1 }
  ];
}


