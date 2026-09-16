import "./Cart.css";
import { useNavigate } from "react-router-dom";

function Cart({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onClose,
}) {
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
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
          <span className="cart-system">
            CYBERSAGE://CART
          </span>

          <h2>YOUR CART</h2>

          <p>
            {totalItems}{" "}
            {totalItems === 1 ? "ITEM" : "ITEMS"}
          </p>
        </div>

        <button
          className="cart-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">[ ]</div>

          <h3>VAULT EMPTY</h3>

          <p>
            No hardware has been added to your system.
          </p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.cartId || item.id}
              >
                <div className="cart-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="cart-item-info">
                  <span>VERIFIED HARDWARE</span>

                  <h3>{item.name}</h3>

                  <p>
                    R{Number(item.price).toFixed(2)}
                  </p>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        onDecrease(item.id)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        onIncrease(item.id)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-item"
                  onClick={() =>
                    onRemove(item.id)
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              <span>SUBTOTAL</span>

              <strong>
                R{subtotal.toFixed(2)}
              </strong>
            </div>

            <button
              className="checkout-button"
              onClick={handleCheckout}
            >
              INITIALISE CHECKOUT →
            </button>

            <button
              className="clear-cart-button"
              onClick={onClear}
            >
              CLEAR SYSTEM CART
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

export default Cart;