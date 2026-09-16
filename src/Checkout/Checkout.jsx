import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

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

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [cart]);

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

      const response = await fetch(`${API_URL}/orders`, {
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

      alert("Order created successfully.");
      console.log("Order created successfully:", data);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong while creating your order.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="empty-grid"></div>

        <div className="empty-box">
          <span className="empty-code">ERROR // VAULT_EMPTY_001</span>

          <div className="empty-icon">×</div>

          <span className="empty-label">ORDER MANIFEST</span>

          <h1>VAULT EMPTY</h1>

          <p>
            No hardware has been authorized for checkout.
            <br />
            Return to the vault and select your equipment.
          </p>

          <button onClick={() => navigate("/Shop")}>
            RETURN TO VAULT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-grid"></div>
      <div className="checkout-scan"></div>

      <header className="checkout-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span>←</span>
          RETURN TO VAULT
        </button>

        <div className="checkout-logo">
          <span>CYBER</span>SAGE
        </div>

        <div className="secure-checkout">
          <i></i>
          TRANSACTION SECURE
        </div>
      </header>

      <main className="checkout-container">
        <section className="checkout-form-section">
          <div className="checkout-heading">
            <div className="heading-meta">
              <span>VAULT // CHECKOUT</span>
              <span>SESSION: ACTIVE</span>
            </div>

            <h1>
              COMPLETE
              <br />
              <em>ORDER.</em>
            </h1>

            <div className="heading-line">
              <span></span>
              <small>HARDWARE ACQUISITION PROTOCOL</small>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-top">
              <div>
                <span className="section-number">01</span>
                <h2>SECURE DATA</h2>
              </div>

              <span className="section-status">
                <i></i>
                REQUIRED
              </span>
            </div>

            <div className="section-label">PERSONAL INFORMATION</div>

            <div className="form-grid">
              <div className="input-group">
                <label>FIRST NAME</label>

                <div className="input-wrap">
                  <span>&gt;</span>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="ENTER FIRST NAME"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>LAST NAME</label>

                <div className="input-wrap">
                  <span>&gt;</span>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="ENTER LAST NAME"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>EMAIL ADDRESS</label>

                <div className="input-wrap">
                  <span>@</span>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="OPERATOR@EMAIL.COM"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>PHONE NUMBER</label>

                <div className="input-wrap">
                  <span>#</span>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+27 XX XXX XXXX"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-top">
              <div>
                <span className="section-number">02</span>
                <h2>DELIVERY DATA</h2>
              </div>

              <span className="section-status">
                <i></i>
                SECURE
              </span>
            </div>

            <div className="section-label">SHIPPING DESTINATION</div>

            <div className="form-grid">
              <div className="input-group">
                <label>COUNTRY / REGION</label>

                <div className="input-wrap">
                  <span>+</span>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="COUNTRY"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>CITY</label>

                <div className="input-wrap">
                  <span>+</span>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="CITY"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>STREET ADDRESS</label>

                <div className="input-wrap">
                  <span>+</span>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="DELIVERY ADDRESS"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>POSTAL CODE</label>

                <div className="input-wrap">
                  <span>#</span>

                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="POSTAL CODE"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-top">
              <div>
                <span className="section-number">03</span>
                <h2>DELIVERY PROTOCOL</h2>
              </div>

              <span className="section-status">
                <i></i>
                SELECT ONE
              </span>
            </div>

            <div className="delivery-options">
              <label
                className={`delivery-option ${
                  delivery === "standard" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={delivery === "standard"}
                  onChange={(e) => setDelivery(e.target.value)}
                />

                <span className="radio-mark"></span>

                <div>
                  <strong>STANDARD DELIVERY</strong>
                  <small>DELIVERY WITHIN 5–7 DAYS</small>
                </div>

                <span className="delivery-price">FREE</span>
              </label>

              <label
                className={`delivery-option ${
                  delivery === "express" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={delivery === "express"}
                  onChange={(e) => setDelivery(e.target.value)}
                />

                <span className="radio-mark"></span>

                <div>
                  <strong>EXPRESS SHIPPING</strong>
                  <small>DELIVERY WITHIN 1–3 DAYS</small>
                </div>

                <span className="delivery-price">R50.00</span>
              </label>
            </div>
          </div>

          <div className="checkout-section">
            <div className="section-top">
              <div>
                <span className="section-number">04</span>
                <h2>PAYMENT PROTOCOL</h2>
              </div>

              <span className="section-status">
                <i></i>
                ENCRYPTED
              </span>
            </div>

            <div className="payment-options">
              <label className={payment === "card" ? "active" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={payment === "card"}
                  onChange={(e) => setPayment(e.target.value)}
                />

                <span className="payment-radio"></span>
                <span>CREDIT CARD</span>
              </label>

              <label className={payment === "paypal" ? "active" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={payment === "paypal"}
                  onChange={(e) => setPayment(e.target.value)}
                />

                <span className="payment-radio"></span>
                <span>PAYPAL</span>
              </label>

              <label className={payment === "applepay" ? "active" : ""}>
                <input
                  type="radio"
                  name="payment"
                  value="applepay"
                  checked={payment === "applepay"}
                  onChange={(e) => setPayment(e.target.value)}
                />

                <span className="payment-radio"></span>
                <span>APPLE PAY</span>
              </label>
            </div>

            {payment === "card" && (
              <div className="card-details">
                <div className="input-group full">
                  <label>CARD NUMBER</label>

                  <div className="input-wrap">
                    <span>◆</span>

                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>CARDHOLDER NAME</label>

                  <div className="input-wrap">
                    <span>&gt;</span>

                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="CARDHOLDER"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>EXPIRATION DATE</label>

                  <div className="input-wrap">
                    <span>◷</span>

                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>CVV</label>

                  <div className="input-wrap">
                    <span>●</span>

                    <input
                      type="text"
                      name="cvv"
                      placeholder="000"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <label className="terms">
            <input type="checkbox" required />
            <span className="check-box"></span>
            I AGREE TO THE CYBERSAGE TERMS AND CONDITIONS.
          </label>

          <button
            type="button"
            className="place-order-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            <span>
              {loading
                ? "AUTHORIZING TRANSACTION..."
                : "AUTHORIZE & PLACE ORDER"}
            </span>

            <strong>
              {loading ? "..." : formatPrice(total)}
            </strong>

            <b>→</b>
          </button>

          <div className="checkout-security">
            <span>● SSL ENCRYPTED</span>
            <span>● SECURE TRANSACTION</span>
            <span>● CYBERSAGE VAULT</span>
          </div>
        </section>

        <aside className="order-summary">
          <div className="summary-top">
            <div>
              <span className="summary-code">
                MANIFEST // {String(cart.length).padStart(2, "0")}
              </span>

              <h2>ORDER<br />MANIFEST</h2>
            </div>

            <div className="vault-status">
              <span></span>
              READY
            </div>
          </div>

          <div className="manifest-line"></div>

          <div className="summary-products">
            {cart.map((item, index) => (
              <div
                className="summary-product"
                key={item.cartId || item.id || item._id}
              >
                <div className="product-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="summary-image">
                  <img src={item.image} alt={item.name} />

                  <span className="image-corner top-left"></span>
                  <span className="image-corner top-right"></span>
                  <span className="image-corner bottom-left"></span>
                  <span className="image-corner bottom-right"></span>
                </div>

                <div className="summary-product-info">
                  <span>HARDWARE // VERIFIED</span>

                  <h3>{item.name}</h3>

                  <p>{item.category || "CYBERSAGE HARDWARE"}</p>

                  <div className="product-meta">
                    <small>QTY {String(item.quantity).padStart(2, "0")}</small>
                    <small>
                      {formatPrice(
                        Number(item.price) * Number(item.quantity),
                      )}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-divider">
            <span>TRANSACTION DATA</span>
          </div>

          <div className="promo">
            <span>&gt;_</span>

            <input
              type="text"
              placeholder="ENTER PROMO CODE"
            />

            <button>APPLY</button>
          </div>

          <div className="summary-lines">
            <div>
              <span>SUBTOTAL</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div>
              <span>SHIPPING</span>
              <strong>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </strong>
            </div>

            <div>
              <span>DISCOUNT</span>
              <strong>{formatPrice(discount)}</strong>
            </div>
          </div>

          <div className="total-line">
            <div>
              <span>TOTAL AUTHORIZATION</span>
              <small>ZAR // SOUTH AFRICAN RAND</small>
            </div>

            <strong>{formatPrice(total)}</strong>
          </div>

          <div className="summary-security">
            <div className="security-icon">✓</div>

            <div>
              <strong>VAULT VERIFIED</strong>
              <p>
                Your hardware manifest is ready
                for transaction authorization.
              </p>
            </div>
          </div>
        </aside>
      </main>

      <section className="checkout-bottom">
        <div className="bottom-grid"></div>

        <div className="bottom-content">
          <div>
            <span className="bottom-label">CYBERSAGE // HARDWARE VAULT</span>

            <p>
              PREDICT. PREVENT. PROTECT.
              <br />
              SECURE HARDWARE. POWERFUL PERFORMANCE.
            </p>
          </div>

          <div className="bottom-title">
            <span>YOUR SYSTEM.</span>
            <strong>YOUR DEFENCE.</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;