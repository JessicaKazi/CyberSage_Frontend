import "./Cart.css";
import { useNavigate } from "react-router-dom";

function Cart({ cart, onIncrease, onDecrease, onRemove, onClear, onClose }) {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    navigate("/checkout", {
      state: {
        cart: cart,
      },
    });
  };

  return (
    <aside className="cart">
      <div className="cart-header">
        <div>
          <h2>Your Cart</h2>

          <p>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>

        <button className="cart-close" onClick={onClose}>
          ×
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>

          <p>Add some products to get started.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.cartId || item._id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p>R{Number(item.price).toFixed(2)}</p>

                  <div className="quantity-controls">
                    <button onClick={() => onDecrease(item._id)}>−</button>

                    <span>{item.quantity}</span>

                    <button onClick={() => onIncrease(item._id)}>+</button>
                  </div>
                </div>

                <button
                  className="remove-item"
                  onClick={() => onRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              <span>Subtotal</span>

              <strong>R{subtotal.toFixed(2)}</strong>
            </div>

            <button className="checkout-button" onClick={handleCheckout}>
              CHECKOUT
            </button>

            <button className="clear-cart-button" onClick={onClear}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default Cart;
