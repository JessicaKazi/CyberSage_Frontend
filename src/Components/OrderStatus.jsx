import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./OrderStatus.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const statuses = ["Pending", "Processing", "Shipped", "Delivered"];

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getUserOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        navigate("/SignUp");
        return;
      }

      const user = JSON.parse(savedUser);

      const userId = user?.id || user?._id;

      if (!userId) {
        setError("Unable to identify your account.");
        return;
      }

      const response = await fetch(`${API_URL}/orders/user/${userId}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load your orders.");
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Order status error:", error);

      setError(
        error.message || "Unable to load your orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  const getStatusIndex = (status) => {
    return statuses.indexOf(status);
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductName = (item) => {
    return item?.name || item?.productName || item?.title || "Unknown product";
  };

  const getProductQuantity = (item) => {
    return item?.quantity || 1;
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() || "pending";
  };

  if (loading) {
    return (
      <div className="order-page">
        <Navbar />

        <main className="order-main">
          <div className="order-loading">
            <div className="loading-ring"></div>
            <p>ACCESSING ORDER DATABASE...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="order-page">
      <Navbar />

      <main className="order-main">
        <section className="order-header">
          <div>
            <span className="order-label">
              // CYBERSAGE / ORDER INTELLIGENCE
            </span>

            <h1>
              ORDER
              <span> STATUS</span>
            </h1>

            <p>
              Track your hardware deployment and monitor every stage of your
              order.
            </p>
          </div>

          <button className="refresh-btn" onClick={getUserOrders}>
            ↻ REFRESH
          </button>
        </section>

        {error && (
          <div className="order-error">
            <span>!</span>
            {error}
          </div>
        )}

        {!error && orders.length === 0 && (
          <section className="empty-orders">
            <div className="empty-icon">∅</div>

            <span>// NO ACTIVE ORDERS</span>

            <h2>ORDER DATABASE EMPTY</h2>

            <p>
              You have not placed any orders yet. Your purchases will appear
              here.
            </p>

            <button onClick={() => navigate("/shop")}>
              ENTER HARDWARE VAULT
            </button>
          </section>
        )}

        <section className="orders-list">
          {orders.map((order) => {
            const currentStatus = order.status || "Pending";
            const currentIndex = getStatusIndex(currentStatus);

            const items = order.cart || order.items || order.products || [];

            return (
              <article
                className="order-card"
                key={order._id || order.id || order.orderNumber}
              >
                <div className="order-card-top">
                  <div>
                    <span className="mini-label">ORDER IDENTIFIER</span>

                    <h2>{order.orderNumber || order._id || "UNKNOWN"}</h2>
                  </div>

                  <div
                    className={`order-status ${getStatusClass(currentStatus)}`}
                  >
                    <i></i>
                    {currentStatus}
                  </div>
                </div>

                <div className="order-meta">
                  <div>
                    <span>PLACED</span>
                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>

                  <div>
                    <span>TIME</span>
                    <strong>{formatTime(order.createdAt)}</strong>
                  </div>

                  <div>
                    <span>PAYMENT</span>
                    <strong
                      className={
                        order.paymentStatus?.toLowerCase() === "paid"
                          ? "paid"
                          : ""
                      }
                    >
                      {order.paymentStatus || "Pending"}
                    </strong>
                  </div>

                  <div>
                    <span>TOTAL</span>
                    <strong>R{Number(order.total || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {currentStatus === "Cancelled" ? (
                  <div className="cancelled-box">
                    <div className="cancelled-icon">×</div>

                    <div>
                      <span>ORDER TERMINATED</span>
                      <p>This order has been cancelled.</p>
                    </div>
                  </div>
                ) : (
                  <div className="tracking">
                    <div className="tracking-line">
                      <div
                        className="tracking-progress"
                        style={{
                          width:
                            currentIndex >= 0
                              ? `${
                                  (currentIndex / (statuses.length - 1)) * 100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>

                    <div className="tracking-steps">
                      {statuses.map((status, index) => {
                        const completed = index <= currentIndex;

                        const active = index === currentIndex;

                        return (
                          <div
                            className={`tracking-step ${
                              completed ? "completed" : ""
                            } ${active ? "active" : ""}`}
                            key={status}
                          >
                            <div className="step-dot">
                              {completed
                                ? "✓"
                                : String(index + 1).padStart(2, "0")}
                            </div>

                            <span>{status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="order-products">
                  <div className="products-heading">
                    <span>// ORDER MANIFEST</span>
                    <span>
                      {items.length} ITEM
                      {items.length !== 1 ? "S" : ""}
                    </span>
                  </div>

                  {items.map((item, index) => (
                    <div
                      className="order-product"
                      key={item?.id || item?._id || index}
                    >
                      <div className="product-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="product-info">
                        <strong>{getProductName(item)}</strong>

                        <span>QTY: {getProductQuantity(item)}</span>
                      </div>

                      <strong>
                        R
                        {Number(item?.price || item?.unitPrice || 0).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span>LAST UPDATED: {formatDate(order.updatedAt)}</span>

                  <span>
                    STATUS CODE: {currentStatus.toUpperCase().replace(" ", "_")}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderStatus;
