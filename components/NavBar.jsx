import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const NavBar = () => {
  const [hasPurchases, setHasPurchases] = useState(false);

  useEffect(() => {
    const checkPurchases = async () => {
      try {
        const response = await api.get('/api/v1/orders/my-orders');
        setHasPurchases(response.data.length > 0);
      } catch (err) {
        console.error('Error checking purchases:', err);
      }
    };
    
    checkPurchases();
  }, []);

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/inventory">Inventory</Link>
      {hasPurchases && <Link to="/order-tracking">Order Tracking</Link>}
      {/* Other nav items */}
    </nav>
  );
};

export default NavBar;