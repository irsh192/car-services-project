import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faHeadphones, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import pexelspixabay from '../assets/images/pexelspixabay.jpg';


const ProductDetails = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedOption, setSelectedOption] = useState('description');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
      const fetchProduct = async () => {
          const response = await fetch(`http://localhost:5001/product/${productId}`);
          const data = await response.json();
          setProduct(data);
          setSelectedImage(data.images[0]); // Assuming images is an array
      };
      fetchProduct();
  }, [productId]);
  const handleImageChange = (image) => {
      setSelectedImage(image);
  };
  const handleOptionChange = (option) => {
      setSelectedOption(option === selectedOption ? '' : option); // Toggle option visibility
  };
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = cart.findIndex(item => item.productId === productId);

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };



  if (!product) {
      return <div>Loading...</div>; // Or any other loading state
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
};


  return (
    <div>
      <div className="relative w-full">
        {/* Apply Tailwind CSS classes to the image */}
        <img src={pexelspixabay} alt="Product" className="w-full max-h-64 object-cover" />
        {/* Text container */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h3 className="text-6xl font-bold">Products <span className="text-red-500">Details</span></h3>
        </div>
      </div>
      {/* Product details */}
      <div className="container mx-auto flex justify-center">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-5 mt-10 ml-10">
          {/* Column 1: Image Slider */}
          <div className="col-span-1">
                <Slider {...settings}>
                    {product.images.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt="Product" className="w-64 h-auto" />
                        </div>
                    ))}
                </Slider>
            </div>
          {/* Product details */}
          <div className="col-md-8 single-right-left">
             {/* Column 2: Title */}
             <div className="col-span-1">
                <h3 className="text-xl font-semibold text-teal-500 mb-1 capitalize tracking-wide ml-5">{product.name}</h3>
            </div>
            <p className="single-right-left text-black text-xl my-2 md:my-4 ml-6">
                <span className="item_price mr-2">Pkr-{product.price}</span>
            </p>
            <div className="rating1 ml-6">
                <span className="flex items-center">
                    <input id="rating5" type="radio" name="rating" value="5" className="sr-only" />
                    <label htmlFor="rating5" className="text-2xl cursor-pointer text-teal-500">★</label>

                    <input id="rating4" type="radio" name="rating" value="4" className="sr-only" />
                    <label htmlFor="rating4" className="text-2xl cursor-pointer text-teal-500">★</label>

                    <input id="rating3" type="radio" name="rating" value="3" className="sr-only" checked />
                    <label htmlFor="rating3" className="text-2xl cursor-pointer text-teal-500">★</label>

                    <input id="rating2" type="radio" name="rating" value="2" className="sr-only" />
                    <label htmlFor="rating2" className="text-2xl cursor-pointer">★</label>

                    <input id="rating1" type="radio" name="rating" value="1" className="sr-only" />
                    <label htmlFor="rating1" className="text-2xl cursor-pointer">★</label>
                </span>
            </div>
            <p className="single-right-left text-black my-2 md:my-4 ml-6">
                <span className="item_price mr-2">{product.shortDescription}</span>
            </p>
            <div className="color-quality">
                  <div className="color-quality-right">
                      <h5 className="font-bold ml-6 mt-4">Quantity :</h5>
                      <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)))} min="1" className="w-16 h-10 border border-gray-300 rounded-lg ml-6 mt-2" />
                  </div>
              </div>

            <div className="occasion-cart w-3/10 ml-6 mt-6">
            {product.stock_quantity < 1 ? (
              <button disabled className="button text-white bg-gray-500 text-sm uppercase py-2 px-0 w-full">Out Of Stock</button>
            ) : (
              <button onClick={addToCart} className="button text-white bg-teal-500 hover:bg-teal-600 text-sm uppercase py-2 px-0 w-full outline-none font-semibold tracking-wide transition-all duration-500">Add to cart</button>
            )}
            </div>
            {/* Text links for selecting option */}
          </div>
        </div>
      </div>
      <div className="container mx-auto w-3/4 border  border-gray-300 rounded-lg p-3 mt-20">
      <h3 className="text-xl font-semibold text-teal-500 mb-1 capitalize tracking-wide ml-5">Description</h3>
      <div className="ml-6 mt-5">
              {selectedOption === 'description' && (
                <p className="text-justify">Description ipsum dolor sit amet, consectetur adipisicing elPellentesque vehicula augue eget nisl ullamcorper, molestie blandit ipsum auctor. Mauris volutpat augue dolor.Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut lab ore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco. labore et dolore magna aliqua..</p>
              )}
            </div>
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

export default ProductDetails;
