import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const AddProduct = () => {
  const fileInputRef = useRef(null);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const isEditing = productId !== undefined;

  const { isSuperuser } = useAuth();
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productCategory: '',
    totalItemsInStock: 0,
    shortDescription: '',
    price: 0,
    images: []  // This will hold File objects, not URLs
  });
  const byteArrayToBase64 = (byteArray) => {
    if (!byteArray) {
      console.error("byteArray is undefined or null");
      return ""; // Return empty string or handle as needed
    }
    const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    return window.btoa(binaryString);
  };
  
  useEffect(() => {
    fetch('http://localhost:5001/all-categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
    
    if (productId) {
      fetch(`http://localhost:5001/product/${productId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setFormData({
            productName: data.name,
            productDescription: data.description,
            productCategory: data.category_id,
            totalItemsInStock: data.stock_quantity,
            shortDescription: data.shortDescription,
            price: data.price,
            images: data.images.map(img => ({
              imageData: img,
              isExisting: true
            }))
          });
          console.log('Product details:', data);
        })
        .catch(error => console.error('Error fetching product details:', error));
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, type, files } = e.target;
    if (type === 'file') {
      const imageFiles = [];
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          imageFiles.push({ file, isExisting: false });
        }
      }
      setFormData(prevFormData => ({
        ...prevFormData,
        images: [...prevFormData.images, ...imageFiles]
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: e.target.value
      }));
    }
  };
  

const handleRemoveImage = (index) => {
  // Remove the image from the state
  setFormData(prevFormData => ({
    ...prevFormData,
    images: prevFormData.images.filter((_, i) => i !== index)
  }));

  // Reset the file input to clear all selections
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    // Append all text fields
    data.append('productName', formData.productName);
    data.append('productDescription', formData.productDescription);
    data.append('productCategory', formData.productCategory);
    data.append('shortDescription', formData.shortDescription);
    data.append('totalItemsInStock', formData.totalItemsInStock);
    data.append('price', formData.price);
    // Append files
    formData.images.forEach((img) => {
      if (!img.isExisting) { // Check if the image is not an existing one
        data.append('images', img.file); // Append the file, not the file object
      }
    });
  
  
    const url = `http://localhost:5001/${productId ? `update-product/${productId}` : 'add-product'}`;
    const method = productId ? 'PUT' : 'POST';
    
    fetch(url, {
      method: method,
      body: data,
    })
    .then(response => response.json())
    .then(() => {
      navigate('/inventory');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  return (
    <div>

      {/* Centered Button */}
      <div className="flex justify-center mt-4 space-x-4">
        {isSuperuser && (
          <>
            <a href="/inventory" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            All Servics & Product
            </a>
            <a href="/all-categories" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Categories
            </a>
            <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add Product
            </a>
            <a href="/AddCategory" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add Category
            </a>
          </>
        )}
        <a href="/profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
         Profile 
        </a>
        <a href="/orders" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Orders
        </a>
      </div>
      {/* Product Form */}
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-5 border border-gray-500">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditing ? 'Update Product' : 'Add Product'}
      </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="name">Product Name</label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="price">Short Description</label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="description">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
            ></textarea>
          </div>
          <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            id="productCategory"
            name="productCategory"
            value={formData.productCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={`${category._id}`} value={`${category._id}`}>
                {`${category.name} ${category.cat_type}`}
              </option>
            ))}
          </select>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="price">Price</label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="stock_quantity">Stock Quantity</label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              type="number"
              id="totalItemsInStock"
              name="totalItemsInStock"
              value={formData.totalItemsInStock}
              onChange={handleChange}
            />
          </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="product_images">Product Images</label>
              <input
                ref={fileInputRef}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-wrap -mx-2">
              {formData.images.map((img, index) => (
                <div key={index} className="p-2">
                  {img.isExisting ? (
                    console.log(img),
                    <img src={img.imageData} alt="Product" className="w-32 h-32 object-cover" />
                  ) : (
                    img.file && img.file instanceof File ? (
                      <img src={URL.createObjectURL(img.file)} alt="New Product" className="w-32 h-32 object-cover" />
                    ) : (
                      <p>File not available or invalid</p>
                    )
                  )}
                  <button type="button" onClick={() => handleRemoveImage(index)} className="ml-2 bg-red-500 text-white p-1 rounded">
                    Remove
                  </button>
                </div>
              ))}
            </div>

          <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="submit">Add Product</button>
        </form>
      </div>
  </div>
  );
};

export default AddProduct;