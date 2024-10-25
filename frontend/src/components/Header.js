import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';



const navigationLinks = [
  
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { label: "Car Services", children: [] },
  { label: "Car Product", children: [] },
  { path: '/contact', label: 'Contact' },
  ];

  const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const location = useLocation();
  const { totalItems } = useCart();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/fetch-categories');
        const data = await response.json();
        if (response.ok) {
          const menWear = data.filter(cat => cat.cat_type === 'services');
          const womenWear = data.filter(cat => cat.cat_type === 'productis');
          navigationLinks.find(link => link.label === "Car Services").children = menWear;
          navigationLinks.find(link => link.label === "Car Product").children = womenWear;
        } else {
          throw new Error(data.message || 'Error fetching categories');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchCategories();
  }, []);

  const toggleMenu = (index) => {
    setIsMenuOpen(!isMenuOpen);
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };
  const { isLoggedIn, logout } = useAuth(); // Accessing isLoggedIn from our AuthContext
  const isActive = (path) => {
    return location.pathname === path;
  };
  const handleLogout = async (e) => {
    e.preventDefault(); // This prevents navigation or page reload
    await logout(); // Calls the logout function from your AuthContext
  };
  const categorizedLinks = navigationLinks.reduce((acc, link) => {
    acc[link.cat_type] = [...(acc[link.cat_type] || []), link];
    return acc;
  }, {});

  const handleMouseEnter = (index) => {
    setOpenMenuIndex(index);
  };

  const handleMouseLeave = () => {
    setOpenMenuIndex(null);
  };

  return (
    <div>
      {!isLoggedIn && (
      <div className="bg-black header-bot_inner_wthreeinfo_header_mid mx-auto w-90">
        <div className="container">
          <ul className="flex">
            <li className="w-1/4 text-center text-white text-xs py-2 border-r border-gray-700">
              <a href="/signin" className="text-white no-underline">
                <i className="fa fa-unlock-alt mr-2 text-teal-500" aria-hidden="true"></i> Sign In
              </a>
            </li>
            <li className="w-1/4 text-center text-white text-xs py-2 border-r border-gray-700">
              <a href="/signup" className="text-white no-underline">
                <i className="fa fa-pencil-square-o mr-2" aria-hidden="true"></i> Sign Up
              </a>
            </li>
            <li className="w-1/4 text-center text-white text-xs py-2 border-r border-gray-700">
              <i className="fa fa-phone mr-2" aria-hidden="true"></i> Call : 0349-1504947
            </li>
            <li className="w-1/4 text-center text-white text-xs py-2">
              <i className="fa fa-envelope-o mr-2" aria-hidden="true"></i> <a href="" className="text-white">shah.jee6446@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      )}

      {/* Centered Logo */}
      <div className="flex justify-center items-center my-4">
        <h1 className="text-6xl md:text-5xl py-4 md:py-0 mb-3 mt-3">
          <a href="/" className="font-light text-black">
            <span className="bg-black px-5 py-1 font-bold text-white">Pro</span>Motors
          </a>
        </h1>
      </div>

      {/* Existing React component */}
      <div className="relative">
        <div className="bg-black shadow-slate-300 p-6 text-white text-center shadow-transparent shadow-md">
          <div className="flex justify-between items-center">

          <nav className="hidden md:flex md:items-center md:w-full justify-center space-x-4">
            {navigationLinks.filter(link => link.label !== 'Logout').map((link, index) => (
              <div key={index} className="relative" onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}>
                <Link to={link.path} className="cursor-pointer text-white md:hover:text-sky-700" onClick={() => toggleMenu(index)}>
                  {link.label}
                </Link>
                {link.children && (
                  <div className={`absolute top-full left-0 bg-white text-black p-2 z-99 shadow-md ${openMenuIndex === index ? 'block' : 'hidden'}`} style={{ zIndex: 99, width: '140px' }}>
                    {link.children.map((childLink, childIndex) => (
                      <Link key={childIndex} to={childLink.path} className="block text-center">
                        {childLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoggedIn && (
            <div className="relative">
              <Link to="/cart" className="cursor-pointer text-white md:hover:text-sky-700">
                Cart
                {totalItems > 0 && (
                  <span className="absolute inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
            )}
          </nav>
            
            {isLoggedIn && (
              <>
              <Link to='/profile' className="hidden md:block text-white hover:text-sky-700 focus:outline-none">
              Admin
              </Link>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Link onClick={handleLogout} className="hidden md:block text-white hover:text-sky-700 focus:outline-none">
              Logout
            </Link>
            </>
            )}

            {/* Mobile Menu Button on the Right */}
            <div className="ml-auto md:hidden">
              <button onClick={toggleMenu} className="text-white hover:text-white-800 focus:outline-none">
                {isMenuOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
              </button>
            </div>

            {/* Dropdown Menu for Mobile */}
            <div className={`absolute top-full inset-x-0 bg-teal-800 p-3 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
              {navigationLinks.filter(link => link.label !== 'Logout').map((link, index) => (
                <div key={index} className="block text-center">
                  <Link to={link.path} className={`block text-white hover:text-sky-700 ${isActive(link.path) ? 'font-bold' : ''}`}>
                    {link.label}
                  </Link>
                  {link.children && (
                    <div>
                      {link.children.map((childLink, childIndex) => (
                        <Link key={childIndex} to={childLink.path} className={`block text-center ${isActive(childLink.path) ? 'font-bold' : ''}`}>
                          {childLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
