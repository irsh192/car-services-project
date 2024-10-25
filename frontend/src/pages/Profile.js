import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; 

const Profile = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });

  const { isSuperuser } = useAuth();
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('userData')).id;
    console.log('userId:', userId);
    if (userId) {
      fetch(`http://localhost:5001/profile/${userId}`)
        .then(response => response.json())
        .then(data => setFormData(data))
        .catch(error => console.error('Error loading the profile:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem('userData')).id;
    if (!userId) {
      alert('User ID is missing.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5001/profile/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Success:', data);
        alert('Profile updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating profile: ' + error.message);
    }
  };


    

  return (
    <div>

      {/* Centered Button */}
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
          <a href="/AddCategory" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Category
          </a>
        </>
        )}
        <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
         Profile 
        </a>
        <a href="/orders" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Orders
        </a>
      </div>
      {/* Product Form */}
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-5 border border-gray-500">
      <br/>
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="first_name">First Name</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="last_name">Last Name</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="email">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="street_address">Street Address</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            id="street_address"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="city">City</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="state">State</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="postal_code">Postal Code</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="country">Country</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="submit">Submit</button>
      </form>
    </div>  
  </div>
  );
};

export default Profile;