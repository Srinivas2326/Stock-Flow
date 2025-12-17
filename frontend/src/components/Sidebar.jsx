import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">StockFlow</h2>
      <p className="subtitle">Inventory Management</p>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/products">Inventory</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
