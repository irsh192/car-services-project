import React, { useState } from 'react';

function SignupForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    street_address:'',
    city:'',
    state:'',
    postal_code:'',
    country:'',
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = JSON.stringify({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      is_superuser: false,
      street_address:'',
      city:'',
      state:'',
      postal_code:'',
      country:'',

    });
    console.log("Request Body:", requestBody);
    try {
      const response = await fetch('http://localhost:5001/signup', { 
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: requestBody,
      });
      const responseData = await response.json(); // Parse JSON response
      if (response.ok) {
        console.log("Signup successful", responseData.message); // Optionally log the success message from the response
        window.location.href = '/signin';
      } else {
        console.error("Signup failed", responseData.message); // Optionally log the failure message from the response
        // Check for the 'USER_ALREADY_EXISTS' special message
        if (responseData.specialMsg === 'USER_ALREADY_EXISTS') {
          alert('A user with the provided email already exists. Please log in.');
          window.location.href = '/signin'; // Redirect to login if the user already exists
        } else {
          // Handle other errors or display a generic error message
          alert('Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-5 border border-gray-500">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
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
            required
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
            required
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

export default SignupForm;
