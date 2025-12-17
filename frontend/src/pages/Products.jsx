import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";

const Products = () => {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadProducts = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.get("/products", { headers });
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`, { headers });
      loadProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your inventory</p>
        </div>
        <button onClick={() => setShowAdd(true)}>+ Add Product</button>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && (
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Qty</th>
              <th>Cost (₹)</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.quantity}</td>

                <td>
                  ₹{" "}
                  {typeof p.costPrice === "number"
                    ? p.costPrice.toFixed(2)
                    : "0.00"}
                </td>

                <td>
                  ₹{" "}
                  {typeof p.sellingPrice === "number"
                    ? p.sellingPrice.toFixed(2)
                    : "0.00"}
                </td>

                <td>
                  <button onClick={() => setEditProduct(p)}>✏️</button>
                  <button onClick={() => deleteProduct(p._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAdd && (
        <AddProductModal
          close={() => {
            setShowAdd(false);
            loadProducts();
          }}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          close={() => {
            setEditProduct(null);
            loadProducts();
          }}
        />
      )}
    </>
  );
};

export default Products;
