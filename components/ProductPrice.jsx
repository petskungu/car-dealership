import { useSelector } from 'react-redux';
import { formatPrice } from '../utils/currency';

const ProductPrice = ({ price }) => {
  const currency = useSelector(state => state.currency);

  return (
    <div className="product-price">
      {formatPrice(price, currency)}
    </div>
  );
};

export default ProductPrice;
