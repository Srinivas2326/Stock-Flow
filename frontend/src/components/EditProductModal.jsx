import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const EditProductModal = ({ product, close }) => {
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    quantity: product.quantity || 0,
    costPrice: product.costPrice ?? "",
    sellingPrice: product.sellingPrice ?? "",
    lowStockThreshold: product.lowStockThreshold ?? 5,
  });

  const [error, setError] = useState("");

  const submitHandler = async () => {
    setError("");

    if (form.costPrice === "" || form.sellingPrice === "") {
      setError("Cost price and selling price are required");
      return;
    }

    try {
      await api.put(
        `/products/${product._id}`,
        {
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
      setError("Failed to update product");
    }
  };

  return (
    <div className="modal">
      <h3>Edit Product</h3>

      <p><strong>{product.name}</strong></p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) =>
          setForm({ ...form, quantity: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Cost Price (₹)"
        value={form.costPrice}
        onChange={(e) =>
          setForm({ ...form, costPrice: e.target.value })
        }
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

      <button onClick={submitHandler}>Update</button>
      <button onClick={close}>Cancel</button>
    </div>
  );
};

export default EditProductModal;
