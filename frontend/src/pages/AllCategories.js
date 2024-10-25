import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext'; 

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const { isSuperuser } = useAuth();
  useEffect(() => {
    fetch('http://localhost:5001/all-categories')
      .then(response => response.json())  // Convert the response to JSON
      .then(data => setCategories(data))  // Set the JSON data to state
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div>

      {/* Centered Button */}
      <div className="flex justify-center mt-4 space-x-4">
        {isSuperuser && (
          <>
            <a href="/inventory" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            All Services & Product
            </a>
            <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Categories
          </a>
          <a href="/AddProduct" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Product
          </a>
          <a href="/AddCategory" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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

      {/* Products Table */}
      <div className="mt-4 flex justify-center">
        <table className="table-auto w-full lg:w-4/5 xl:w-3/4">
          <thead className="bg-gray-200">
            <tr>
              
              <th className="px-2 py-2">Id</th>
              <th className="px-2 py-2">Category</th>
              <th className="px-2 py-2">Category type</th>
              
            </tr>
          </thead>
          <tbody>
            {categories.map((category,index) => (
              <tr key={category.id} className="border-b">
                <td className="px-2 py-2 text-center">{index + 1}</td>
                <td className="px-2 py-2 text-center">{category.name}</td>
                <td className="px-2 py-2 text-center">{category.cat_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCategories;