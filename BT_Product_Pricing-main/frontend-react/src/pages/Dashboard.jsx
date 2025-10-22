import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCurrency } from '../providers/CurrencyProvider.jsx';
import api from '../services/api.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { format } = useCurrency();
  const [stats, setStats] = useState({ products: 0, roles: 0, charges: 0, rules: 0, transactions: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    
    Promise.all([
      api.get('/dashboard/stats').catch(() => ({ products: 6, roles: 15, charges: 2, rules: 1, transactions: 4 })),
      api.get('/dashboard/activity').catch(() => getSampleActivity())
    ]).then(([s, a]) => { 
      if (mounted) { 
        setStats(s); 
        setActivity(a); 
        setLoading(false);
      } 
    }).catch(err => {
      if (mounted) {
        setError(err.message);
        setLoading(false);
      }
    });
    
    return () => { mounted = false; };
  }, []);

  const revenueData = {
    labels: Array.from({ length: 7 }).map((_, i) => new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Revenue',
      data: Array.from({ length: 7 }).map((_, i) => 80000 + Math.random() * 60000),
      borderColor: '#4a70e0',
      backgroundColor: '#4a70e033',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }]
  };

  const productData = {
    labels: ['FD Products', 'Savings', 'Current', 'Loans', 'Insurance'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: ['#4a70e0', '#28a745', '#ffc107', '#dc3545', '#17a2b8'],
      borderWidth: 0
    }]
  };

  if (loading) {
    return (
      <div id="dashboard" className="page active">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Loading...</p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="dashboard" className="page active">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard" className="page active">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your product pricing management system</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="fa-box" label="Products" value={stats.products} color="products" />
        <StatCard icon="fa-users" label="Roles" value={stats.roles} color="roles" />
        <StatCard icon="fa-money-bill-wave" label="Charges" value={stats.charges} color="charges" />
        <StatCard icon="fa-clipboard-list" label="Business Rules" value={stats.rules} color="business-rules" />
        <StatCard icon="fa-credit-card" label="Transaction Types" value={stats.transactions} color="transaction-types" />
        <StatCard icon="fa-chart-line" label="Reports" value={12} color="reports" />
      </div>

      <div className="analytics-section">
        <div className="analytics-grid">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Revenue Analytics</h3>
            </div>
            <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => format(ctx.parsed.y) } } }, scales: { y: { ticks: { callback: (v) => format(v) } } } }} />
          </div>
          <div className="chart-container">
            <div className="chart-header"><h3>Product Distribution</h3></div>
            <Doughnut data={productData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="recent-activity">
            <div className="activity-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-list">
              {activity.length === 0 ? <div className="activity-item">No recent activity</div> : activity.map((item, i) => (
                <div className="activity-item" key={i}>
                  <div className="activity-icon" style={{ background: '#17a2b8' }}><i className={`fas fa-info`}></i></div>
                  <div className="activity-content">
                    <div className="activity-text">{item.message}</div>
                    <div className="activity-time">{new Date(item.timestamp || Date.now()).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="quick-actions">
            <div className="quick-actions-header"><h3>Quick Actions</h3></div>
            <div className="quick-actions-grid">
              <button className="quick-action-btn"><i className="fas fa-plus"></i><span>Add Product</span></button>
              <button className="quick-action-btn"><i className="fas fa-money-bill"></i><span>Add Charge</span></button>
              <button className="quick-action-btn"><i className="fas fa-cog"></i><span>Create Rule</span></button>
              <button className="quick-action-btn"><i className="fas fa-download"></i><span>Export Data</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card animated-card">
      <div className={`stat-icon ${color}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-content">
        <div className="stat-number">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function getSampleActivity() {
  return [
    {
      type: 'create',
      message: 'New product "Premium FD" created',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      type: 'update',
      message: 'Role "Manager" permissions updated',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString()
    },
    {
      type: 'system',
      message: 'System backup completed successfully',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString()
    }
  ];
}


