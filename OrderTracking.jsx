import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/api/v1/orders/my-orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (orders.length === 0) {
    return (
      <div className="tracking-container">
        <h2>Order Tracking</h2>
        <div className="alert alert-warning">
          You haven't made any purchases yet.
        </div>
        <Link to="/" className="btn btn-primary">
          Return to Main Page
        </Link>
      </div>
    );
  }

  return (
    <div className="tracking-container">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
            <p>Status: {order.status}</p>
            <div className="tracking-updates">
              {order.trackingUpdates.map((update, index) => (
                <div key={index} className="update">
                  <p>{update.message}</p>
                  <small>{new Date(update.updatedAt).toLocaleString()}</small>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Link to="/" className="btn btn-primary">
        Return to Main Page
      </Link>
    </div>
  );
};

export default OrderTracking;