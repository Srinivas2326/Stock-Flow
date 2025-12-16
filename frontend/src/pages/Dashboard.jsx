import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

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

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Dashboard</h2>

        {loading && <p>Loading dashboard...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <p>
              <strong>Total Products:</strong> {data.totalProducts}
            </p>

            <p>
              <strong>Total Quantity:</strong> {data.totalQuantity}
            </p>

            <h3>Low Stock Items</h3>

            {data.lowStock.length === 0 ? (
              <p>No low stock items 🎉</p>
            ) : (
              <ul>
                {data.lowStock.map((item) => (
                  <li key={item._id}>
                    {item.name} – Qty: {item.quantity}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
