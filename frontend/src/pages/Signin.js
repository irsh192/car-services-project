import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // Access the login function from your context
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reqbody = JSON.stringify(formData);
    console.log(reqbody);
    try {
      await login(formData.email, formData.password); // Use the login function with email and password
    } catch (error) {
      console.error('Login failed:', error);
    }

  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-8 border border-gray-500">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
       
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="email">Email</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-800"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-bold" htmlFor="password">Password</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginForm;
