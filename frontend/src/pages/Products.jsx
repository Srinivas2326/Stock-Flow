import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";

const Products = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const loadProducts = async () => {
    const res = await api.get("/products", { headers });
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your inventory</p>
        </div>
        <button onClick={() => setShowAdd(true)}>+ Add Product</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Cost</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.quantity}</td>
              <td>${p.costPrice}</td>
              <td>${p.sellingPrice}</td>
              <td>
                <button onClick={() => setEditProduct(p)}>✏️</button>
                <button
                  onClick={async () => {
                    await api.delete(`/products/${p._id}`, { headers });
                    loadProducts();
                  }}
                >🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAdd && <AddProductModal close={() => { setShowAdd(false); loadProducts(); }} />}
      {editProduct && <EditProductModal product={editProduct} close={() => { setEditProduct(null); loadProducts(); }} />}
    </>
  );
};

export default Products;
