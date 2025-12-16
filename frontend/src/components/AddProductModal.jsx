import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const AddProductModal = ({ close }) => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", sku: "", quantity: 0 });

  const submit = async () => {
    await api.post("/products", form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    close();
  };

  return (
    <div className="modal">
      <h3>Add Product</h3>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="SKU" onChange={e => setForm({ ...form, sku: e.target.value })} />
      <input type="number" placeholder="Quantity" onChange={e => setForm({ ...form, quantity: e.target.value })} />
      <button onClick={submit}>Add Product</button>
      <button onClick={close}>Cancel</button>
    </div>
  );
};

export default AddProductModal;
