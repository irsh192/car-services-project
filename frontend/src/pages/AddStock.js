import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext'; 
import { useParams } from 'react-router-dom';

const AddStock = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    stock: ''
  });
  const { isSuperuser } = useAuth();

  useEffect(() => {
    // Fetch product details including update history
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5001/product/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch the product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/add-stock/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: formData.stock, productid: productId })
      });
      if (!response.ok) {
        throw new Error('Failed to add stock');
      }
      alert('Stock added successfully!');
      setFormData({ stock: '' }); // Reset form
    } catch (error) {
      alert('Failed to add stock: ' + error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-center mt-4 space-x-4">
      {isSuperuser && (
        <>
          <a href="/inventory" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          All Services & Product
          </a>
          <a href="/all-categories" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Categories
          </a>
          <a href="/AddProduct" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Product
          </a>
          <a href="" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Category
          </a>
        </>
      )}
        <a href="/profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
         Profile 
        </a>
        <a href="/orders" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Orders
        </a>
      </div>
      {/* UI elements... */}
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-5 border border-gray-500">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Stock</h2>
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="stock">Add Quanitity</label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="submit">Add Stock</button>
        </form>
      </div>

      {/* Displaying update history in a table */}
      {product && Array.isArray(product.updated_at) && (
        <div className="max-w-2xl mx-auto mt-6">
          <h3 className="text-lg font-bold">Update History</h3>
          <table className="w-full mt-3 border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {product.updated_at.map((update, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{new Date(update.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{update.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddStock;
