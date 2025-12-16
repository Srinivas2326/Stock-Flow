import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Products</Link>
        <Link to="/settings">Settings</Link>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
