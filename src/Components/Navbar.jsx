import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");

  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("Could not parse user:", error);
    }
  }

  const isAdmin = user?.role === "admin";

  const links = [
    ["COMMAND", "/"],
    ["VAULT", "/shop"],
    ["BUILD", "/build"],
    ["SECURITY", "/security"],
    ["INTEL", "/about"],
    ["SUPPORT", "/support"],
    ["ANALYZE", "/systemanalyzer"]
  ];

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="cyber-nav">
      <Link to="/" className="cyber-logo" onClick={closeMenu}>
        <span>CYBER</span>SAGE
      </Link>

      <div className={`cyber-links ${open ? "nav-open" : ""}`}>
        {links.map(([label, path]) => (
          <Link key={label} to={path} onClick={closeMenu}>
            <span>
              0{links.findIndex((item) => item[0] === label) + 1}
            </span>
            {label}
          </Link>
        ))}

        {isAdmin && (
          <Link
            to="/admin/orders"
            className="admin-orders-link"
            onClick={closeMenu}
          >
            <span>07</span>
            ADMIN ORDERS
          </Link>
        )}

        <Link
          to="/status"
          className="mobile-status"
          onClick={closeMenu}
        >
          SYSTEM STATUS
        </Link>
      </div>

      <div className="nav-right">
        <button
          className="nav-status"
          onClick={() => navigate("/status")}
        >
          <i></i>
          SYSTEM ONLINE
        </button>

        <button
          className={`nav-menu ${open ? "menu-open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;