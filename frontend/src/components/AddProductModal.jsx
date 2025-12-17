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

  const submit = async () => {
    setError("");

    // ✅ Backend validation alignment
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
      await api.post(
        "/products",
        {
          name: form.name,
          sku: form.sku,
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
    }
  };

  return (
    <div className="modal">
      <h3>Add Product</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="SKU"
        value={form.sku}
        onChange={(e) => setForm({ ...form, sku: e.target.value })}
      />

      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      />

      <input
        type="number"
        placeholder="Cost Price (₹)"
        value={form.costPrice}
        onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
      />

      <input
        type="number"
        placeholder="Selling Price (₹)"
        value={form.sellingPrice}
        onChange={(e) =>
          setForm({ ...form, sellingPrice: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Low Stock Threshold"
        value={form.lowStockThreshold}
        onChange={(e) =>
          setForm({ ...form, lowStockThreshold: e.target.value })
        }
      />

      <div style={{ marginTop: "12px" }}>
        <button onClick={submit}>Add Product</button>
        <button onClick={close}>Cancel</button>
      </div>
    </div>
  );
};

export default AddProductModal;
