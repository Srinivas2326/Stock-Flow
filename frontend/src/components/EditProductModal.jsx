import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const EditProductModal = ({ product, close }) => {
  const { token } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(product.quantity);

  const update = async () => {
    await api.put(`/products/${product._id}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    close();
  };

  return (
    <div className="modal">
      <h3>Edit Product</h3>
      <p>{product.name}</p>
      <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <button onClick={update}>Update</button>
      <button onClick={close}>Cancel</button>
    </div>
  );
};

export default EditProductModal;
