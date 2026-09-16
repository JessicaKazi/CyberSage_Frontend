import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const savedUser = localStorage.getItem("user");
  const user = JSON.parse(savedUser);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
          navigate("/SignUp");
          return;
        }

        const user = JSON.parse(savedUser);

        const isAdmin =
          user?.role === "admin" ||
          user?.isAdmin === true ||
          user?.admin === true;

        if (!isAdmin) {
          navigate("/Home");
          return;
        }

        await fetchOrders();
      } catch (err) {
        console.error("Admin access error:", err);
        navigate("/Home");
      }
    };

    checkAdmin();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          "x-user-email": user.email,
        },
      });

      if (!response.ok) {
        throw new Error("Could not load orders");
      }

      const data = await response.json();

      const orderList = Array.isArray(data) ? data : data.orders || [];

      setOrders(orderList);
    } catch (err) {
      console.error("Orders error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOrderId = (order) => {
    return order._id || order.id || order.orderId || "UNKNOWN";
  };

  const getOrderStatus = (order) => {
    return (order.status || order.orderStatus || "pending").toLowerCase();
  };

  const getCustomer = (order) => {
    return order.customer || {};
  };

  const getCustomerName = (order) => {
    const customer = getCustomer(order);

    const fullName = [customer.firstName, customer.lastName]
      .filter(Boolean)
      .join(" ");

    return (
      fullName || customer.name || order.customerName || "Unknown customer"
    );
  };

  const getCustomerEmail = (order) => {
    const customer = getCustomer(order);

    return customer.email || order.email || "No email";
  };

  const getItems = (order) => {
    return order.cart || order.items || order.products || [];
  };

  const getTotal = (order) => {
    return Number(order.total || order.amount || order.grandTotal || 0);
  };

  const formatPrice = (price) => {
    return `R${Number(price || 0).toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (order) => {
    const date =
      order.createdAt || order.created_at || order.date || order.orderDate;

    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-ZA", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer = getCustomer(order);

      const query = search.toLowerCase().trim();

      const orderId = String(getOrderId(order)).toLowerCase();

      const name = getCustomerName(order).toLowerCase();

      const email = getCustomerEmail(order).toLowerCase();

      const matchesSearch =
        !query ||
        orderId.includes(query) ||
        name.includes(query) ||
        email.includes(query);

      const status = getOrderStatus(order);

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const statistics = useMemo(() => {
    const totalRevenue = orders.reduce(
      (total, order) => total + getTotal(order),
      0,
    );

    const pending = orders.filter(
      (order) => getOrderStatus(order) === "pending",
    ).length;

    const processing = orders.filter(
      (order) => getOrderStatus(order) === "processing",
    ).length;

    const completed = orders.filter((order) =>
      ["completed", "delivered", "paid"].includes(getOrderStatus(order)),
    ).length;

    return {
      total: orders.length,
      revenue: totalRevenue,
      pending,
      processing,
      completed,
    };
  }, [orders]);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user.email,
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          String(order._id) === String(orderId)
            ? {
                ...order,
                status: data.status,
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loader"></div>

        <p>INITIALIZING ORDER COMMAND CENTER...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="admin-error-box">
          <span>ERROR // 500</span>

          <h2>ORDER DATABASE OFFLINE</h2>

          <p>{error}</p>

          <button onClick={fetchOrders}>RETRY CONNECTION</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">CYBERSAGE // ADMINISTRATOR</p>

          <h1>
            ORDER
            <span> COMMAND.</span>
          </h1>

          <p className="admin-description">
            Centralized order monitoring and fulfillment control system.
          </p>
        </div>

        <div className="admin-access">
          <span className="access-dot"></span>
          ADMIN ACCESS
        </div>
      </header>

      <section className="admin-stats">
        <div className="stat-card">
          <span className="stat-label">TOTAL ORDERS</span>

          <strong>{statistics.total}</strong>

          <small>DATABASE RECORDS</small>
        </div>

        <div className="stat-card">
          <span className="stat-label">REVENUE</span>

          <strong>{formatPrice(statistics.revenue)}</strong>

          <small>ORDER VALUE</small>
        </div>

        <div className="stat-card">
          <span className="stat-label">PENDING</span>

          <strong>{statistics.pending}</strong>

          <small>AWAITING ACTION</small>
        </div>

        <div className="stat-card">
          <span className="stat-label">PROCESSING</span>

          <strong>{statistics.processing}</strong>

          <small>IN PROGRESS</small>
        </div>

        <div className="stat-card">
          <span className="stat-label">COMPLETED</span>

          <strong>{statistics.completed}</strong>

          <small>FULFILLED</small>
        </div>
      </section>

      <section className="admin-controls">
        <div className="search-box">
          <span>&gt;</span>

          <input
            type="text"
            placeholder="SEARCH ORDER / CUSTOMER / EMAIL"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <span>STATUS</span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ALL ORDERS</option>
            <option value="pending">PENDING</option>
            <option value="processing">PROCESSING</option>
            <option value="completed">COMPLETED</option>
            <option value="delivered">DELIVERED</option>
            <option value="cancelled">CANCELLED</option>
          </select>
        </div>

        <button className="refresh-button" onClick={fetchOrders}>
          ↻ REFRESH
        </button>
      </section>

      <section className="orders-section">
        <div className="orders-heading">
          <div>
            <p>LIVE DATABASE</p>

            <h2>ALL ORDERS</h2>
          </div>

          <span>{filteredOrders.length} RECORDS</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <span>DATABASE // EMPTY</span>

            <h3>NO ORDERS FOUND</h3>

            <p>No orders match the current search parameters.</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order, index) => {
              const orderId = getOrderId(order);

              const status = getOrderStatus(order);

              const customer = getCustomer(order);

              const items = getItems(order);

              const isOpen = expandedOrder === orderId;

              return (
                <article
                  className={`order-card ${isOpen ? "order-open" : ""}`}
                  key={orderId}
                >
                  <button
                    className="order-main"
                    onClick={() => toggleOrder(orderId)}
                  >
                    <div className="order-index">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="order-identity">
                      <span>
                        ORDER //
                        {String(orderId).slice(-8).toUpperCase()}
                      </span>

                      <strong>{getCustomerName(order)}</strong>

                      <small>{getCustomerEmail(order)}</small>
                    </div>

                    <div className="order-date">
                      <span>CREATED</span>

                      <strong>{formatDate(order)}</strong>
                    </div>

                    <div className="order-items">
                      <span>ITEMS</span>

                      <strong>
                        {items.reduce(
                          (total, item) => total + Number(item.quantity || 1),
                          0,
                        )}
                      </strong>
                    </div>

                    <div className="order-total">
                      <span>TOTAL</span>

                      <strong>{formatPrice(getTotal(order))}</strong>
                    </div>

                    <div className={`order-status status-${status}`}>
                      {status}
                    </div>

                    <div className="order-expand">{isOpen ? "−" : "+"}</div>
                  </button>

                  {isOpen && (
                    <div className="order-details">
                      <div className="detail-grid">
                        <div className="info-panel">
                          <span className="panel-title">CUSTOMER DATA</span>

                          <p>
                            <small>NAME</small>
                            {getCustomerName(order)}
                          </p>

                          <p>
                            <small>EMAIL</small>
                            {getCustomerEmail(order)}
                          </p>

                          <p>
                            <small>PHONE</small>
                            {customer.phone || "Not provided"}
                          </p>
                        </div>

                        <div className="info-panel">
                          <span className="panel-title">DELIVERY DATA</span>

                          <p>
                            <small>METHOD</small>
                            {order.delivery || "Standard"}
                          </p>

                          <p>
                            <small>ADDRESS</small>
                            {customer.address || "Not provided"}
                          </p>

                          <p>
                            <small>LOCATION</small>
                            {customer.city || "Not provided"}
                            {customer.postalCode
                              ? `, ${customer.postalCode}`
                              : ""}
                          </p>
                        </div>

                        <div className="info-panel">
                          <span className="panel-title">PAYMENT DATA</span>

                          <p>
                            <small>METHOD</small>
                            {order.payment || "Not specified"}
                          </p>

                          <p>
                            <small>SUBTOTAL</small>
                            {formatPrice(order.subtotal)}
                          </p>

                          <p>
                            <small>SHIPPING</small>
                            {formatPrice(order.shipping)}
                          </p>

                          <p>
                            <small>TOTAL</small>
                            {formatPrice(getTotal(order))}
                          </p>
                        </div>
                      </div>

                      <div className="products-panel">
                        <div className="panel-title">ORDER MANIFEST</div>

                        {items.length === 0 ? (
                          <p className="no-items">
                            No product information available.
                          </p>
                        ) : (
                          <div className="manifest">
                            {items.map((item, itemIndex) => (
                              <div
                                className="manifest-item"
                                key={item.id || item._id || itemIndex}
                              >
                                <span className="manifest-number">
                                  {String(itemIndex + 1).padStart(2, "0")}
                                </span>

                                <div className="manifest-image">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} />
                                  ) : (
                                    <span>N/A</span>
                                  )}
                                </div>

                                <div className="manifest-info">
                                  <strong>
                                    {item.name || "Unknown product"}
                                  </strong>

                                  <span>
                                    QTY //
                                    {item.quantity || 1}
                                  </span>
                                </div>

                                <strong>
                                  {formatPrice(
                                    Number(item.price || 0) *
                                      Number(item.quantity || 1),
                                  )}
                                </strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="status-controls">
                        <span>UPDATE ORDER STATUS</span>

                        <div>
                          {[
                            "pending",
                            "processing",
                            "completed",
                            "delivered",
                            "cancelled",
                          ].map((option) => (
                            <button
                              key={option}
                              className={status === option ? "active" : ""}
                              onClick={() => updateStatus(order, option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminOrders;
