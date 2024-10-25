// In AuthContext.js or wherever your context is defined
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(); // This creates the context

export const useAuth = () => useContext(AuthContext); // This is your custom hook

export const AuthProvider = ({ children }) => {
    const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    const [isLoggedIn, setIsLoggedIn] = useState(userData ? true : false);
    const [isSuperuser, setIsSuperuser] = useState(userData ? userData.is_superuser : false);

  
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
        setIsLoggedIn(true);
        setIsSuperuser(data.user.is_superuser);
        localStorage.setItem('userData', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        throw new Error(data.status || 'Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message);
    }
  };
  
  const logout = async () => {
    try {
      await fetch('http://localhost:5001/logout', { method: 'POST' }); // Adjust as necessary for your backend
      setIsLoggedIn(false);
      localStorage.clear(); // This clears everything from localStorage
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  // Make sure to include isLoggedIn in the value provided to the provider
  return (
    <AuthContext.Provider value={{ isLoggedIn, isSuperuser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
