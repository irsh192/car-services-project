import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext'; 


const Backend = () => {
  function truncateText(text, length) {
    if (!text) return ''; // Handles null or undefined
    if (text.length > length) {
      return text.substring(0, length) + '...';
    } else {
      return text;
    }
  }
  
  const { isSuperuser } = useAuth();
  const [products, setProducts] = useState([]); // State to hold the products

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/all-products'); // Adjust URL as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data); // Set the products in state
        console.log('Products:', data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
      }
    };

    fetchProducts();
  }, [isSuperuser]);
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/product/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete the product');
      }

      const newProducts = products.filter(product => product._id !== id);
      setProducts(newProducts);
      alert('Product deleted successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>

      {/* Centered Button */}
      <div className="flex justify-center mt-4 space-x-4">
        <>
          <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          All Services & Product
          </a>
          <a href="/all-categories" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Categories
          </a>
          <a href="/AddProduct" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Product
          </a>
          <a href="/AddCategory" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Category
          </a>
        </>
        <a href="/profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
         Profile 
        </a>
        <a href="/orders" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Orders
        </a>
      </div>

      {/* Products Table */}
      <div className="mt-4 flex justify-center">
  <table className="table-auto w-full lg:w-4/5 xl:w-3/4">
    <thead className="bg-gray-200">
      <tr>
        <th className="px-2 py-2">Image</th>
        <th className="px-2 py-2">Product Name</th>
        
        <th className="px-2 py-2">Total Items in Stock</th>
        <th className="px-2 py-2">Total Sold</th>
        <th className="px-2 py-2">Price</th>
        <th className="px-2 py-2">Action</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id} className="border-b">
          
          <td className="px-2 py-2 text-center">
          {product.images && product.images.length > 0 && (
            <img src={`data:${product.images[0].contentType};base64,${product.images[0].imageData}`} alt={`Image of ${product.name}`} style={{ width: '100px', height: 'auto' }} />
          )}
          </td>
          <td className="px-2 py-2 text-center">{product.name}</td>
          
          <td className="px-2 py-2 text-center">{product.stock_quantity}</td>
          <td className="px-2 py-2 text-center">{product.total_sold}</td>
          <td className="px-2 py-2 text-center">{product.price}</td>
          <td className="px-2 py-2 text-center">
            <a href={`/update-product/${product._id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
            </a>
            &nbsp;
            <a onClick={() => deleteProduct(product._id)} className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Remove
            </a>
            &nbsp;
            <a href={`/add-stock/${product._id}`} className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Stock
            </a>
            </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Backend;