import React, { useState, useEffect } from "react";
import pexelspixabay from "../assets/images/pexelspixabay.jpg";
import { useParams } from "react-router-dom";
import { useCart } from "../CartContext";

const AllProduct = () => {
  const { addToCart } = useCart();
  const { cat_type, category_name } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({ services: [], products: [] });
  useEffect(() => {
    fetch("http://localhost:5001/all-categories")
      .then((response) => response.json())
      .then((data) => {
        const servicesCategories = data.filter(
          (category) => category.cat_type.toLowerCase() === "services"
        );
        const productisCategories = data.filter(
          (category) => category.cat_type.toLowerCase() === "products"
        );
        setCategories({
          services: servicesCategories,
          productis: productisCategories,
        });
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5001/products/${cat_type}/${category_name}`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [cat_type, category_name]);
  return (
    <div>
      {/* Add the provided JSX code snippet */}
      <div className="relative w-full">
        {/* Apply Tailwind CSS classes to the image */}
        <img
          src={pexelspixabay}
          alt="Product"
          className="w-full max-h-64 object-cover"
        />
        {/* Text container */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h3 className="text-6xl font-bold">
            Products <span className="text-red-500">Details</span>
          </h3>
        </div>
      </div>

      <div className="flex w-11/12 mx-auto">
        {/* Categories */}
        <div className="w-3/12 mr-8">
          <div className="card border mt-10 bg-gray-200 p-10 rounded">
            <div className="card-body mb-10">
              {cat_type === "services" && (
                <>
                  <h4 className="card-title text-xl font-semibold mb-2">
                    Car Services
                  </h4>
                  <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                    {categories.services.map((category) => (
                      <li key={category._id}>
                        <a href={`/${category.cat_type}/${category.name}`}>
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {cat_type === "products" && (
                <>
                  <h4 className="card-title text-xl font-semibold mb-2">
                    Car Products
                  </h4>
                  <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                    {categories.productis.map((category) => (
                      <li key={category._id}>
                        <a href={`/${category.cat_type}/${category.name}`}>
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Products */}
        <div className="w-9/12 flex flex-wrap">
          {products.map((product) => (
            <div key={product.id} className="w-1/3 p-4">
              <div className="product-men">
                <div className="men-pro-item bg-gray-200 hover:shadow-lg overflow-hidden transition duration-300 hover:bg-gray-100 transform hover:scale-105">
                  <div className="men-thumb-item">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="item-info-product px-4 py-3">
                    <h4 className="text-red-500 text-lg">
                      <a href={`/single-product/${product._id}`}>
                        {product.name}
                      </a>
                    </h4>
                    <div className="info-product-price flex items-center">
                      <span className="item_price text-gray-600 mr-2">
                        Pkr{product.price}
                      </span>
                    </div>
                    <div className="men-cart-pro mt-3">
                      {product.stock_quantity < 1 ? (
                        <button
                          disabled
                          className="btn btn-primary w-full bg-gray-500 text-white py-2 px-4 rounded-md text-xs uppercase font-semibold"
                        >
                          Out Of Stock
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(product._id, 1)}
                          className="btn btn-primary w-full bg-green-500 text-white py-2 px-4 rounded-md text-xs uppercase font-semibold tracking-wide transition duration-300 hover:bg-green-600"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
