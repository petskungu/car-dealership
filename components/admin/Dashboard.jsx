import { useState, useEffect } from 'react';
import { Tab, Tabs, Alert } from 'react-bootstrap';
import InventoryPanel from './InventoryPanel';
import OrdersPanel from './OrdersPanel';
import ActivityLog from './ActivityLog';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [key, setKey] = useState('inventory');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/v1/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard statistics');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Dealership Management Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {stats && (
        <div className="dashboard-stats mb-4">
          <div className="stat-card">
            <h3>{stats.carsInStock}</h3>
            <p>Vehicles in Stock</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
          <div className="stat-card">
            <h3>{stats.recentActivities}</h3>
            <p>Recent Activities</p>
          </div>
        </div>
      )}

      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="inventory" title="Inventory">
          <InventoryPanel />
        </Tab>
        <Tab eventKey="orders" title="Orders">
          <OrdersPanel />
        </Tab>
        <Tab eventKey="activity" title="Activity Log">
          <ActivityLog />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;