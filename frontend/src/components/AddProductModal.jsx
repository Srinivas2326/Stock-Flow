import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const AddProductModal = ({ close }) => {
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: 0,
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: 5,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setError("");

    // ✅ Required field validation
    if (
      !form.name ||
      !form.sku ||
      form.costPrice === "" ||
      form.sellingPrice === ""
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/products",
        {
          name: form.name.trim(),
          sku: form.sku.trim().toUpperCase(),
          quantity: Number(form.quantity),
          costPrice: Number(form.costPrice),
          sellingPrice: Number(form.sellingPrice),
          lowStockThreshold: Number(form.lowStockThreshold),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      close();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Add Product</h3>

        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label>Product Name</label>
          <input
            placeholder="e.g. Rice"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>SKU</label>
          <input
            placeholder="e.g. RICE001"
            value={form.sku}
            onChange={(e) =>
              setForm({ ...form, sku: e.target.value })
            }
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Low Stock Alert</label>
            <input
              type="number"
              value={form.lowStockThreshold}
              onChange={(e) =>
                setForm({
                  ...form,
                  lowStockThreshold: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Cost Price (₹)</label>
            <input
              type="number"
              placeholder="e.g. 1200"
              value={form.costPrice}
              onChange={(e) =>
                setForm({ ...form, costPrice: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Selling Price (₹)</label>
            <input
              type="number"
              placeholder="e.g. 1350"
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  sellingPrice: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={submitHandler}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

          <button className="btn-secondary" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
