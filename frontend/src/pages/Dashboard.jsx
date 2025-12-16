import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Total Products: {data.totalProducts}</p>
      <p>Total Quantity: {data.totalQuantity}</p>

      <h3>Low Stock Items</h3>

      {data.lowStock.length === 0 ? (
        <p>No low stock items 🎉</p>
      ) : (
        data.lowStock.map(item => (
          <p key={item._id}>
            {item.name} – {item.quantity}
          </p>
        ))
      )}
    </div>
  );
};

export default Dashboard;
