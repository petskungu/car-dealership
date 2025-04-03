import ProductPrice from './ProductPrice';
import { useState } from 'react';
import Modal from './Modal';

const CarCard = ({ car }) => {
    return (
        <div className="car-card">
          <img src={car.image} alt={`${car.make} ${car.model}`} />
          <div className="car-details">
            <h3>{car.year} {car.make} {car.model}</h3>
            <div className="car-price">
              <ProductPrice price={car.price} />
            </div>
            {/* Other car details */}
          </div>
        </div>
      );
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="car-card">
      <img src={car.image} alt={`${car.make} ${car.model}`} />
      <div className="car-info">
        <h3>{car.year} {car.make} {car.model}</h3>
        <button 
          className="details-btn"
          onClick={() => setShowDetails(true)}
        >
          Details
        </button>
      </div>

      {showDetails && (
        <Modal onClose={() => setShowDetails(false)}>
          <div className="car-details-modal">
            <h2>{car.year} {car.make} {car.model}</h2>
            <p>Price: ${car.price.toLocaleString()}</p>
            <p>Mileage: {car.mileage.toLocaleString()} miles</p>
            <h4>Features:</h4>
            <ul>
              {car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className="close-btn"
              onClick={() => setShowDetails(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CarCard;

