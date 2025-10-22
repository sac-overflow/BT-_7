import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    let mounted = true;
    api.get('/roles').then((data) => mounted && setRoles(data)).catch(() => setRoles(sampleRoles()));
    return () => { mounted = false; };
  }, []);

  return (
    <div id="roles" className="page active">
      <div className="page-header">
        <h2>Roles Management</h2>
        <p>Define user roles and permissions</p>
        <button className="btn btn-primary"><i className="fas fa-plus"></i> Add Role</button>
      </div>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Role Name</th><th>Description</th><th>Permissions</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.roleId}>
                <td>{r.roleId}</td>
                <td><strong>{r.roleName}</strong></td>
                <td>{r.description}</td>
                <td><div className="permissions">{(r.permissions||[]).map(p => <span className="permission-badge" key={p}>{p}</span>)}</div></td>
                <td><span className={`status-badge ${r.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>{r.status}</span></td>
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

function sampleRoles() {
  return [
    { roleId: 1, roleName: 'Admin', description: 'Full system access', permissions: ['read','write','delete','admin'], status: 'ACTIVE' },
    { roleId: 2, roleName: 'Manager', description: 'Management access', permissions: ['read','write'], status: 'ACTIVE' },
    { roleId: 3, roleName: 'Analyst', description: 'Reporting access', permissions: ['read'], status: 'ACTIVE' }
  ];
}


