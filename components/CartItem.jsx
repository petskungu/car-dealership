import ProductPrice from './ProductPrice';

const CartItem = ({ item }) => {
  return (
    <div className="cart-item">
      <div className="item-details">
        <h4>{item.car.make} {item.car.model}</h4>
        <ProductPrice price={item.car.price * item.quantity} />
      </div>
    </div>
  );
};