import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Settings = () => {
  const { token } = useContext(AuthContext);

  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings", { headers });
        setThreshold(res.data.defaultLowStockThreshold);
      } catch (err) {
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token]);

  // Save settings
  const saveSettings = async () => {
    setMessage("");
    setError("");

    if (threshold < 0) {
      setError("Threshold cannot be negative");
      return;
    }

    try {
      await api.put(
        "/settings",
        { defaultLowStockThreshold: threshold },
        { headers }
      );
      setMessage("Settings saved successfully ✅");
    } catch (err) {
      setError("Failed to save settings");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p>Loading settings...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h2>Settings</h2>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <label>
          <strong>Default Low-Stock Threshold</strong>
        </label>

        <input
          type="number"
          min="0"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />

        <button onClick={saveSettings}>Save Settings</button>

        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          This value is used when a product does not have its own low-stock
          threshold.
        </p>
      </div>
    </>
  );
};

export default Settings;
