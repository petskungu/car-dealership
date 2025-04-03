import { useState } from 'react';
import { Link } from 'react-router-dom';
import CurrencySelector from './CurrencySelector';

const Header = () => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Car Dealership</Link>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          <div 
            className="currency-selector-container"
            onMouseEnter={() => setShowCurrencyDropdown(true)}
            onMouseLeave={() => setShowCurrencyDropdown(false)}
          >
            <button className="currency-toggle">
              <span className="currency-symbol">$</span>
              <span className="currency-code">USD</span>
              <i className="dropdown-icon">▼</i>
            </button>
            
            {showCurrencyDropdown && (
              <div className="currency-dropdown">
                <CurrencySelector />
              </div>
            )}
          </div>

          {/* Other header elements like login/cart */}
        </div>
      </div>
    </header>
  );
};

export default Header;