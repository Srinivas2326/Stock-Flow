import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();          // clear token + auth state
    navigate("/");     // redirect to login
  };

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard" className={isActive("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/products" className={isActive("/products")}>
          Products
        </Link>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
