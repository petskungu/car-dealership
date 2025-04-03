import { useEffect, useState } from 'react';
import api from '../utils/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Load cart from server on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await api.get('/api/v1/cart');
        setCart(response.data.items || []);
        
        // Also sync to localStorage for quick access
        localStorage.setItem('cart', JSON.stringify(response.data.items || []));
      } catch (err) {
        console.error('Failed to load cart', err);
      } finally {
        setInitialized(true);
      }
    };

    loadCart();
  }, []);

  // Sync cart to server whenever it changes
  useEffect(() => {
    if (!initialized) return;
    
    const syncCart = async () => {
      try {
        await api.put('/api/v1/cart', { items: cart });
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (err) {
        console.error('Failed to sync cart', err);
      }
    };

    const timeout = setTimeout(syncCart, 500);
    return () => clearTimeout(timeout);
  }, [cart, initialized]);

  // Add item to cart
  const addItem = async (carId, customOptions = {}) => {
    try {
      const newItem = { carId, customOptions };
      setCart(prev => [...prev, newItem]);
    } catch (err) {
      console.error('Failed to add item', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItem, initialized }}>
      {children}
    </CartContext.Provider>
  );
};