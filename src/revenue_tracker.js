import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  addProduct, 
  getProducts,
  recordSale,
  getSales 
} from './firebaseService';

function RevenueTracker({ userId }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    cost: 0,
    price: 0
  });
  const [newSale, setNewSale] = useState({
    productId: '',
    quantity: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productData, saleData] = await Promise.all([
        getProducts(userId),
        getSales(userId)
      ]);
      setProducts(productData);
      setSales(saleData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name) return;

    try {
      await addProduct(userId, newProduct);
      await loadData();
      setNewProduct({ name: '', cost: 0, price: 0 });
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
    }
  };

  const handleRecordSale = async (e) => {
    e.preventDefault();
    if (!newSale.productId) return;

    try {
      await recordSale(userId, newSale);
      await loadData();
      setNewSale({ productId: '', quantity: 1 });
    } catch (err) {
      setError('Failed to record sale');
      console.error('Error recording sale:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="revenue-tracker">
      <h1>Revenue Tracker</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="forms-container">
        <form onSubmit={handleAddProduct} className="input-form">
          <h2>Add Product</h2>
          <div className="form-group">
            <label>Product Name:</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Cost:</label>
            <input
              type="number"
              value={newProduct.cost}
              onChange={(e) => setNewProduct({...newProduct, cost: Number(e.target.value)})}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
              required
            />
          </div>
          <button type="submit">Add Product</button>
        </form>

        <form onSubmit={handleRecordSale} className="input-form">
          <h2>Record Sale</h2>
          <div className="form-group">
            <label>Product:</label>
            <select
              value={newSale.productId}
              onChange={(e) => setNewSale({...newSale, productId: e.target.value})}
              required
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={newSale.quantity}
              onChange={(e) => setNewSale({...newSale, quantity: Number(e.target.value)})}
              required
            />
          </div>
          <button type="submit">Record Sale</button>
        </form>
      </div>

      <div className="data-lists">
        <div className="products-list">
          <h2>Products</h2>
          {products.length === 0 ? (
            <p>No products yet</p>
          ) : (
            <ul>
              {products.map(product => (
                <li key={product.id}>
                  {product.name} - Cost: ${product.cost} | Price: ${product.price}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="sales-list">
          <h2>Recent Sales</h2>
          {sales.length === 0 ? (
            <p>No sales yet</p>
          ) : (
            <ul>
              {sales.slice(0, 5).map(sale => (
                <li key={sale.id}>
                  {products.find(p => p.id === sale.productId)?.name || 'Unknown Product'} - 
                  Qty: {sale.quantity} | Profit: ${sale.totalProfit}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevenueTracker;