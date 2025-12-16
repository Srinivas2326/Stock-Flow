import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const { token } = useContext(AuthContext);

  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // =========================
  // Fetch current settings
  // =========================
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

    if (token) fetchSettings();
  }, [token]);

  // =========================
  // Save settings
  // =========================
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
    return <p>Loading settings...</p>;
  }

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">
          Manage global inventory preferences
        </p>
      </div>

      {/* SETTINGS CARD */}
      <div className="settings-card">
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <div className="form-group">
          <label>
            <strong>Default Low-Stock Threshold</strong>
          </label>

          <input
            type="number"
            min="0"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />

          <p className="help-text">
            This value is used when a product does not have its own
            low-stock threshold.
          </p>
        </div>

        <button className="primary-btn" onClick={saveSettings}>
          Save Settings
        </button>
      </div>
    </>
  );
};

export default Settings;
