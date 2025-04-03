import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrency } from '../../redux/currencySlice';
import api from '../../utils/api';

const CurrencyPreferences = () => {
  const dispatch = useDispatch();
  const currentCurrency = useSelector(state => state.currency);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCurrencyChange = async (e) => {
    const newCurrencyCode = e.target.value;
    setIsLoading(true);
    
    try {
      // Get current exchange rate
      const rates = await api.get('/api/v1/currencies/rates');
      
      dispatch(setCurrency({
        code: newCurrencyCode,
        symbol: getCurrencySymbol(newCurrencyCode),
        rate: rates.data[newCurrencyCode] || 1
      }));
      
      // Save to user account
      await api.patch('/api/v1/users/currency', { currency: newCurrencyCode });
      
      // Save to localStorage
      localStorage.setItem('preferredCurrency', newCurrencyCode);
    } catch (err) {
      console.error('Failed to update currency', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-section">
      <h3>Currency Preferences</h3>
      <div className="form-group">
        <label>Select Your Preferred Currency</label>
        <select
          value={currentCurrency.code}
          onChange={handleCurrencyChange}
          disabled={isLoading}
          className="form-control"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.currencyCode}>
              {country.name} ({country.currencySymbol} {country.currencyCode})
            </option>
          ))}
        </select>
        {isLoading && <div className="loading-message">Updating currency...</div>}
      </div>
    </div>
  );
};

export default CurrencyPreferences;