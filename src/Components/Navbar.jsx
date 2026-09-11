import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links">
          <Link to="/Home">Home</Link>
          <Link to="/Shop">Shop</Link>
          <Link to="/About">About</Link>
          <Link to="/Build">Build</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
