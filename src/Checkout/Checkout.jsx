import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Cart is passed from the Cart component
  const cart = location.state?.cart || [];

  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "South Africa",
    city: "",
    address: "",
    postalCode: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [cart]);

  // Delivery price
  const shipping = delivery === "express" ? 50 : 0;

  const discount = 0;

  const total = subtotal + shipping - discount;

  const formatPrice = (price) => {
    return `R${Number(price).toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/Shop");
      return;
    }

    setLoading(true);

   try {
  const savedUser = localStorage.getItem("user");

  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("Could not parse logged-in user:", error);
    }
  }

  const customerData = {
    ...formData,
    userId: user?.id || user?._id || null,
  };

  const response = await fetch("http://localhost:3000/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: customerData,
      cart: cart,
      delivery: delivery,
      payment: payment,
      subtotal: subtotal,
      shipping: shipping,
      discount: discount,
      total: total,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  const data = await response.json();

  alert("Order created successfully:", data);
  console.log("Order created successfully:", data);

} catch (error) {
  console.error("Checkout error:", error);
}}


  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h1>Your Cart Is Empty</h1>

        <p>Add some CyberSage products before checking out.</p>

        <button onClick={() => navigate("/Shop")}>RETURN TO SHOP</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="checkout-logo">CYBERSAGE</div>

        <div className="secure-checkout"> Secure Checkout</div>
      </header>

      <main className="checkout-container">
        <section className="checkout-form-section">
          <div className="checkout-heading">
            <span>CYBERSAGE STORE</span>

            <h1>CHECKOUT</h1>
          </div>

          <div className="checkout-section">
            <div className="section-top">
              <h2>Information</h2>

              <p>
                Already have an account? <span>Log in</span>
              </p>
            </div>

            <h3>Personal Information</h3>

            <div className="form-grid">
              <div className="input-group">
                <label>First name</label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Last name</label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Phone number</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h3>Shipping Information</h3>

            <div className="form-grid">
              <div className="input-group">
                <label>Country / Region</label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Address</label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Zip / Postal code</label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Delivery</h2>

            <div className="delivery-options">
              <label className="delivery-option">
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={delivery === "standard"}
                  onChange={(e) => setDelivery(e.target.value)}
                />

                <div>
                  <strong>Standard Delivery</strong>

                  <small>Delivery within 5–7 days</small>
                </div>

                <span>Free</span>
              </label>

              <label className="delivery-option">
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={delivery === "express"}
                  onChange={(e) => setDelivery(e.target.value)}
                />

                <div>
                  <strong>Express Shipping</strong>

                  <small>Delivery within 1–3 days</small>
                </div>

                <span>R50.00</span>
              </label>
            </div>
          </div>

          {/* PAYMENT */}

          <div className="checkout-section">
            <h2>Payment</h2>

            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={payment === "card"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                Credit card
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={payment === "paypal"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                PayPal
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="applepay"
                  checked={payment === "applepay"}
                  onChange={(e) => setPayment(e.target.value)}
                />
                Apple Pay
              </label>
            </div>

            {payment === "card" && (
              <div className="card-details">
                <div className="input-group full">
                  <label>Card number</label>

                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Cardholder name</label>

                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Expiration date</label>

                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>CVV</label>

                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <label className="terms">
            <input type="checkbox" required />I agree to the terms and
            conditions.
          </label>

          <button
            type="button"
            className="place-order-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "PROCESSING..."
              : `PAY AND PLACE ORDER — ${formatPrice(total)}`}
          </button>
        </section>

        <aside className="order-summary">
          <div className="summary-heading">
            <h2>Shopping Bag</h2>

            <span>({cart.length})</span>
          </div>

          <div className="summary-products">
            {cart.map((item) => (
              <div className="summary-product" key={item._id}>
                <div className="summary-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="summary-product-info">
                  <h3>{item.name}</h3>

                  <p>Category: {item.category}</p>

                  <p>Quantity: {item.quantity}</p>
                </div>

                <strong>
                  {formatPrice(Number(item.price) * Number(item.quantity))}
                </strong>
              </div>
            ))}
          </div>

          <div className="promo">
            <input type="text" placeholder="Promo code" />

            <button>APPLY</button>
          </div>

          {/* TOTALS */}

          <div className="summary-lines">
            <div>
              <span>Shipping</span>

              <strong>{shipping === 0 ? "Free" : formatPrice(shipping)}</strong>
            </div>

            <div>
              <span>Discount</span>

              <strong>{formatPrice(discount)}</strong>
            </div>
          </div>

          <div className="total-line">
            <span>Total:</span>

            <strong>{formatPrice(total)}</strong>
          </div>
        </aside>
      </main>

      {/* =====================================
                FOOTER CTA
            ===================================== */}

      <section className="checkout-bottom">
        <div>
          <span>CYBERSAGE</span>

          <p>Secure hardware. Powerful performance.</p>
        </div>

        <h2>
          BUILD YOUR
          <br />
          PERFECT MACHINE.
        </h2>
      </section>
    </div>
  );
}

export default Checkout;
