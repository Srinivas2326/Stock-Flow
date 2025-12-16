import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [data, setData] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStock: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboard();
  }, [token]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Overview of your inventory</p>
      </div>

      {/* STATS CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <p className="card-title">Total Products</p>
          <h2>{data.totalProducts}</h2>
        </div>

        <div className="dashboard-card">
          <p className="card-title">Total Inventory</p>
          <h2>{data.totalQuantity}</h2>
        </div>

        <div className="dashboard-card">
          <p className="card-title">Low Stock Items</p>
          <h2>{data.lowStock.length}</h2>
        </div>
      </div>

      {/* LOW STOCK PANEL */}
      <div className="dashboard-panel">
        {data.lowStock.length === 0 ? (
          <div className="stock-good">
            <div className="icon-circle success">✓</div>
            <h3>All Stock Levels Good</h3>
            <p>No products are currently low on stock</p>
          </div>
        ) : (
          <>
            <h3>Low Stock Items</h3>
            <ul className="low-stock-list">
              {data.lowStock.map(item => (
                <li key={item._id}>
                  <strong>{item.name}</strong> — Qty: {item.quantity}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
