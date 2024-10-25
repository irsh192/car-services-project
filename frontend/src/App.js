// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { useAuth } from './AuthContext'; 
import Header from './components/Header';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import About from './pages/About';
import AddStock from './pages/AddStock';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails'; 
import Cart from './pages/Cart'; // Import the Cart component
import Backend from './pages/Backend';
import Orders from './pages/Orders';
import AllCategories from './pages/AllCategories';
import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import UpdateProduct from './pages/AddProduct';
import Checkout from './pages/Checkout';
import AllProduct from './pages/AllProduct';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Test from './pages/test';
import Profile from './pages/Profile';
import Chatbot from './Chatbot'; // Import the Chatbot component
import './Chatbot.css'; // Import the Chatbot styles

const App = () => {
  const [categoryRoutes, setCategoryRoutes] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Assume this is your API endpoint that returns categories with paths
        const response = await fetch('http://localhost:5001/fetch-categories');
        const categories = await response.json();
        if (response.ok) {
          setCategoryRoutes(categories);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          {/* Dynamic routes for categories */}
          {categoryRoutes.map(route => (
            <Route key={route.path} path="/:cat_type/:category_name" element={<AllProduct />} />
          ))}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/inventory" element={<AdminRoute><Backend /></AdminRoute>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/all-categories" element={<AdminRoute><AllCategories /></AdminRoute>} />
          <Route path="/AddProduct" element={<AdminRoute><AddProduct /></AdminRoute>} />
          <Route path="/single-product/:productId" element={<ProductDetails />} />
          <Route path="/update-product/:productId" element={<AdminRoute><AddProduct /></AdminRoute>} />
          <Route path="/add-stock/:productId" element={<AdminRoute><AddStock /></AdminRoute>} />
          <Route path="/AddCategory" element={<AdminRoute><AddCategory /></AdminRoute>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/allproduct" element={<AllProduct />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<GuestRoute><Signin /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/test" element={<AdminRoute><Test /></AdminRoute>} />
        </Routes>
        <Footer />
        <Chatbot /> {/* Add the Chatbot component here */}
      </Router>
    </CartProvider>
  );
};

const AdminRoute = ({ children }) => {
  const { isSuperuser } = useAuth();
  return isSuperuser ? children : <Navigate replace to="/" />;
};

const GuestRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate replace to="/" /> : children;
};

export default App;
