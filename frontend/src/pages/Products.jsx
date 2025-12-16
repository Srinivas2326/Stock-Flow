import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Products = () => {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", { headers });
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProducts();
  }, [token]);

  const addProduct = async () => {
    if (!name || !sku) {
      setError("Name and SKU are required");
      return;
    }

    try {
      const res = await api.post(
        "/products",
        { name, sku, quantity },
        { headers }
      );
      setProducts([...products, res.data]);
      setName("");
      setSku("");
      setQuantity(0);
      setError("");
    } catch (err) {
      setError("Failed to add product (SKU may already exist)");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`, { headers });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2>Products</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Product Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="SKU"
        value={sku}
        onChange={e => setSku(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
      />

      <button onClick={addProduct}>Add Product</button>

      <hr />

      {products.length === 0 ? (
        <p>No products yet</p>
      ) : (
        products.map(p => (
          <div key={p._id} style={{ marginBottom: "8px" }}>
            <strong>{p.name}</strong> ({p.sku}) – Qty: {p.quantity}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteProduct(p._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Products;
