import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from './redux/currencySlice';
import api from './utils/api';

function App() {
  const dispatch = useDispatch();
  const currency = useSelector(state => state.currency);

  useEffect(() => {
    const initializeCurrency = async () => {
      // Check for saved preference
      const savedCurrency = localStorage.getItem('preferredCurrency');
      
      if (savedCurrency) {
        // Get current exchange rate for saved currency
        try {
          const rates = await api.get('/api/v1/currencies/rates');
          dispatch(setCurrency({
            code: savedCurrency,
            symbol: getCurrencySymbol(savedCurrency),
            rate: rates.data[savedCurrency] || 1
          }));
        } catch (err) {
          console.error('Failed to load exchange rates', err);
        }
      }
      // Else geolocation will run from CurrencySelector component
    };

    initializeCurrency();
  }, [dispatch]);

  // ... rest of your app
}