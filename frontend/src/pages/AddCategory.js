import React, { useState } from "react";
import { useAuth } from "../AuthContext";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    cat_type: "",
    description: "",
  });
  const { isSuperuser } = useAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Category added successfully:", response.status);
        alert("Category added successfully!");
        window.location.href = "/all-categories";
        setFormData({
          name: "",
          cat_type: "",
          description: "",
        });
      } else {
        alert("Duplicate Category Name, Please try again with different name.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category: " + error.message);
    }
  };

  return (
    <div>
      {/* Centered Button */}
      <div className="flex justify-center mt-4 space-x-4 mb-5">
        {isSuperuser && (
          <>
            <a
              href="/inventory"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              All Services & Product
            </a>
            <a
              href="/all-categories"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Categories
            </a>
            <a
              href="/AddProduct"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Product
            </a>
            <a
              href="/AddCategory"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Category
            </a>
          </>
        )}
        <a
          href="/profile"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Profile
        </a>
        <a
          href="/orders"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Orders
        </a>
      </div>
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-5 border border-gray-500">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="name">
              Category Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="cat_type">
              Category Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
              id="cat_type"
              name="cat_type"
              value={formData.cat_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="services">Services</option>
              <option value="products">Product</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="description">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            type="submit"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
