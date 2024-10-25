// About.js
import React from 'react';
import { useAuth } from '../AuthContext';



const Test = () => {
    const { isLoggedIn, login } = useAuth();

  const handleLogin = () => {
    login('info@arbitrage-recycling.com', '12345');
  };
  return (
    <div>
      <h2>Test</h2>
      <p>This is the about page content.</p>
      <button onClick={handleLogin}>
      {isLoggedIn ? 'Log Out' : 'Log In'}
    </button>
    </div>
  );
};

export default Test;
