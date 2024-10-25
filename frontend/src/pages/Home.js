import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Automobile from '../assets/images/Automobile.jpg';
import car2 from '../assets/images/car2.jpg';
import car3 from '../assets/images/car3.jpg';
import car5 from '../assets/images/car5.jpg';
import car4 from '../assets/images/car4.jpg';
import hq720 from '../assets/images/hq720.jpg';
import dreamstime_s_33925547 from '../assets/images/dreamstime_s_33925547.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faTruck, faHeadphones, faShoppingBag, faGift } from '@fortawesome/free-solid-svg-icons';
import AddCategory from './AddCategory';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState(null);
  
  const banners = [
    { image: Automobile, title: '', subtitle: '' },
    { image: car2, title: '', subtitle: ''},
    { image: car3, title: '', subtitle: '' },
    { image: car5, title: '', subtitle: '' },
    { image: car4, title: '', subtitle: '' },
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const { addToCart } = useCart();
  // Fetch categories and their products from backend
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:5001/home-categories');
      const data = await response.json();
      console.log(data);
      setCategories(data);

      // Set the first category for each type as default
      const firstServiceCategory = data.find(category => category.cat_type === 'services');
      const firstProductCategory = data.find(category => category.cat_type === 'products');

      setSelectedServiceCategory(firstServiceCategory?._id);
      setSelectedCategory(firstProductCategory?._id);
    }
    fetchData();
  }, []);

  // Filter products by selected category for services and products
  const filteredServiceProducts = categories.find(category => category._id === selectedServiceCategory)?.products || [];
  const filteredProducts = categories.find(category => category._id === selectedCategory)?.products || [];

  return (
    <div className="bg-white min-h-screen relative z-0">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="relative">
            <img
              src={banner.image}
              alt={`Banner ${index + 1}`}
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'cover' }}
            />
            <div className="absolute inset-0 flex justify-center items-center flex-col text-center text-white">
              <div className="absolute left-0 ml-4">
                {index !== 0 && (
                  <FontAwesomeIcon icon={faChevronLeft} className="text-white text-4xl cursor-pointer hover:text-gray-400" />
                )}
              </div>
              <div className="absolute right-0 mr-4">
                {index !== banners.length - 1 && (
                  <FontAwesomeIcon icon={faChevronRight} className="text-white text-4xl cursor-pointer hover:text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-3xl font-bold">{banner.title}</h3>
                <p className="text-lg">{banner.subtitle}</p>
                {/* <a className="hvr-outline-out button2 text-lg mt-2" href={`banner${index + 1}.jpg`}>Shop Now</a> */}
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div className="banner_bottom_agile_info bg-gray-100 py-16">
        <div className="container mx-auto">
          <div className="banner_bottom_agile_info_inner_w3ls flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="wthree_banner_bottom_grid_three_left1 grid relative mr-5">
                <figure className="effect-roxy relative overflow-hidden">
                  <img src={hq720} alt=" " className="w-full h-auto border border-white-500" />
                  <figcaption className="absolute inset-0 flex flex-col justify-center items-center text-center opacity-0 bg-black bg-opacity-75 text-white transition-opacity duration-300 hover:opacity-100">
                    <h3 className="uppercase text-4xl py-4 text-red-500 ">Fall Ahead</h3>
                    <p>New Arrivals</p>
                  </figcaption>
                </figure>
              </div>
            </div>
            <div className="w-full md:w-1/2 ">
              <div className="wthree_banner_bottom_grid_three_left1 grid relative mt-6 md:mt-0 mr-5">
                <figure className="effect-roxy relative overflow-hidden">
                  <img src={dreamstime_s_33925547} alt=" " className="w-full h-auto border border-white-500" />
                  <figcaption className="absolute inset-0 flex flex-col justify-center items-center text-center opacity-0 bg-black bg-opacity-75 text-white transition-opacity duration-300 hover:opacity-100">
                    <h3 className="uppercase text-4xl py-4 text-red-500">Fall Ahead</h3>
                    <p>New Arrivals</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl sm:text-4xl font-bold text-center tracking-wid mt-5 text-black mb-4 uppercase">
        <span className="text-red-500">Car</span> Services
        </h3>
        <div id="horizontalTab">
          <ul className="flex flex-wrap justify-center sm:justify-between mt-10 w-full max-w-screen-xl mx-auto">
            {categories.filter(category => category.cat_type === 'services')
                .slice(0, 4)
                .map(category => (
              <li
                key={category.id}
                className={`inline-block w-full sm:w-auto cursor-pointer text-black text-center font-semibold uppercase transition-all duration-300 hover:bg-red-700 hover:text-white relative ${
                  selectedCategory === category.id ? "bg-red-500 text-white" : ""
                }`}
                onClick={() => setSelectedServiceCategory(category._id)}
                style={{ padding: '12px 20px', margin: '0', listStyle: 'none', float: 'left', width: '25%', fontSize: '1em', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}
              >
                {category.name}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700 transform scale-x-0 transition-transform duration-300"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-4">
        {filteredServiceProducts.map(product => (
        
          <div className="ml-12 mt-5 shadow-lg" key={product.id}> {/* Applying ml and mt classes */}
            <div className="product-men">
              <div className="men-pro-item bg-gray-200 hover:shadow-lg overflow-hidden transition duration-300 hover:bg-gray-100 transform hover:scale-105">
                <div className="men-thumb-item">
                
                  <img src={product.images[0]} alt={product.name} className="md:col-span-2 md:row-span-2 w-full h-auto" />
                  <span className="product-new-top bg-red-500 text-white py-1 px-2 absolute top-0 left-0">New</span>
                </div>
                <div className="item-info-product px-4 py-3">
                  <h4 className="text-red-500 text-lg"><a href={`/single-product/${product.id}`}>{product.name}</a></h4>
                  <div className="info-product-price flex items-center">
                    <span className="item_price text-gray-600 mr-2">Pkr-{product.price}</span>
                  </div>
                  <div className="men-cart-pro mt-3">
                  {product.stock_quantity < 1 ? (
                    <button disabled className="btn btn-primary w-full bg-gray-500 text-white py-2 px-4 rounded-md text-xs uppercase font-semibold">Out Of Stock</button>
                  ) : (
                    <button onClick={() => addToCart(product.id, 1)} className="btn btn-primary w-full bg-green-500 text-white py-2 px-4 rounded-md text-xs uppercase font-semibold tracking-wide transition duration-300 hover:bg-green-600">Add to Cart</button>
                  )}
                    </div>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
        <div className="px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl sm:text-4xl font-bold text-center tracking-wid mt-5 text-black mb-4 uppercase">
        Car <span className="text-red-500">PRODUCTS</span>
        </h3>
        <div id="horizontalTab">
          <ul className="flex flex-wrap justify-center sm:justify-between mt-10 w-full max-w-screen-xl mx-auto">
            {categories.filter(category => category.cat_type === 'productis')
                .slice(0, 4)
                .map(category => (
              <li
                key={category.id}
                className={`inline-block w-full sm:w-auto cursor-pointer text-black text-center font-semibold uppercase transition-all duration-300 hover:bg-red-700 hover:text-white relative ${
                  selectedCategory === category.id ? "bg-red-500 text-white" : ""
                }`}
                onClick={() => setSelectedCategory(category._id)}
                style={{ padding: '12px 20px', margin: '0', listStyle: 'none', float: 'left', width: '25%', fontSize: '1em', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}
              >
                {category.name}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700 transform scale-x-0 transition-transform duration-300"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-4">
        {filteredProducts.map(product => (
        
          <div className="ml-12 mt-5 shadow-lg" key={product.id}> {/* Applying ml and mt classes */}
            <div className="product-men">
              <div className="men-pro-item bg-gray-200 hover:shadow-lg overflow-hidden transition duration-300 hover:bg-gray-100 transform hover:scale-105">
                <div className="men-thumb-item">
                
                  <img src={product.images[0]} alt={product.name} className="md:col-span-2 md:row-span-2 w-full h-auto" />
                  <span className="product-new-top bg-red-500 text-white py-1 px-2 absolute top-0 left-0">New</span>
                </div>
                <div className="item-info-product px-4 py-3">
                  <h4 className="text-red-500 text-lg"><a href={`/single-product/${product.id}`}>{product.name}</a></h4>
                  <div className="info-product-price flex items-center">
                    <span className="item_price text-gray-600 mr-2">Pkr-{product.price}</span>
                  </div>
                  <div className="men-cart-pro mt-3">
                  {product.stock_quantity < 1 ? (
                    <button disabled className="btn btn-primary w-full bg-gray-500 text-white py-2 px-4 rounded-md text-xs uppercase font-semibold">Out Of Stock</button>
                  ) : (
                    <button onClick={() => addToCart(product.id, 1)} className="btn btn-primary w-full bg-green-500 text-white py-2 px-4 rounded-md text-xs uppercase font-semibold tracking-wide transition duration-300 hover:bg-green-600">Add to Cart</button>
                  )}
                    </div>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      
        <div className="flex ml-6 mt-12 justify-center">
        
          <div className="col-md-3 w3layouts_mail_grid_left flex items-center">
            <div className="w3layouts_mail_grid_left1 hvr-radial-out flex-shrink-0 border border-black p-2 bg-black">
              <FontAwesomeIcon icon={faTruck} className="text-white" />
            </div>
            <div className="w3layouts_mail_grid_left2 text-sm">
              <h3 className='text-teal-500 text-lg ml-2'>FREE SHIPPING</h3>
              <p class="text-gray-600 text-lg leading-relaxed ml-2 ">Lorem ipsum dolor sit amet, consectetur</p>

            </div>
          </div>
          <div className="ml-8"></div>
          <div className="col-md-3 w3layouts_mail_grid_left flex items-center">
            <div className="w3layouts_mail_grid_left1 hvr-radial-out flex-shrink-0 border border-black p-2 bg-black">
              <FontAwesomeIcon icon={faHeadphones} className="text-white" />
            </div>
            <div className="w3layouts_mail_grid_left2 text-sm">
              <h3 className='text-teal-500 text-lg ml-2'>24/7 SUPPORT</h3>
              <p class="text-gray-600 text-lg leading-relaxed ml-2 ">Lorem ipsum dolor sit amet, consectetur</p>
            </div>
          </div>
          <div className="ml-8"></div>
          <div className="col-md-3 w3layouts_mail_grid_left flex items-center">
            <div className="w3layouts_mail_grid_left1 hvr-radial-out flex-shrink-0 border border-black p-2 bg-black">
              <FontAwesomeIcon icon={faShoppingBag} className="text-white" />
            </div>
            <div className="w3layouts_mail_grid_left2 text-sm">
              <h3 className='text-teal-500 text-lg ml-2'>MONEY BACK GUARANTEE</h3>
              <p class="text-gray-600 text-lg leading-relaxed ml-2 ">Lorem ipsum dolor sit amet, consectetur</p>
            </div>
          </div>
        </div>
    </div>

    
   
  );
};

export default Home;
