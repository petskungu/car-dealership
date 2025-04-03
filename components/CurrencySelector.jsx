import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../redux/currencySlice';
import api from '../utils/api';

const CurrencySelector = () => {
  const [isDetecting, setIsDetecting] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const currentCurrency = useSelector(state => state.currency);
  const dispatch = useDispatch();

  // Fetch supported countries and currencies
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/api/v1/currencies/supported');
        setCountries(response.data);
      } catch (err) {
        console.error('Failed to fetch countries', err);
      }
    };
    fetchCountries();
  }, []);

  // Auto-detect user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await api.get(`/api/v1/geolocation?lat=${latitude}&lng=${longitude}`);
          dispatch(setCurrency(response.data.currency));
          localStorage.setItem('preferredCurrency', response.data.currency);
          setIsDetecting(false);
        } catch (err) {
          setError('Failed to detect location');
          setIsDetecting(false);
        }
      },
      (err) => {
        setError('Location access denied. Please select manually.');
        setIsDetecting(false);
      }
    );
  }, [dispatch]);

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    dispatch(setCurrency(newCurrency));
    localStorage.setItem('preferredCurrency', newCurrency);
    
    // Update in user account if logged in
    if (currentCurrency.isLoggedIn) {
      api.patch('/api/v1/users/currency', { currency: newCurrency });
    }
  };

  if (isDetecting) {
    return <div className="currency-loading">Detecting your location...</div>;
  }

  return (
    <div className="currency-selector">
      {error && <div className="currency-error">{error}</div>}
      <select 
        value={currentCurrency.code} 
        onChange={handleCurrencyChange}
        className="form-select"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.currencyCode}>
            {country.name} ({country.currencySymbol} {country.currencyCode})
          </option>
        ))}
      </select>
    </div>
  );
};
