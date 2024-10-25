import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";

function CheckoutForm() {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
  });
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData.id;

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      user_id: userId,
      user: {
        name: formData.fullName,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
      },
      products: products.map((product) => ({
        productId: product._id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
      })),
      total: total,
    };

    fetch("http://localhost:5001/submit-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Order response:", data);
        localStorage.removeItem("cart");
        setProducts([]);
        clearCart();
        alert("Order placed successfully! Thank you for your purchase.");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error placing order:", error);
      });
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (!storedCart || storedCart === "[]") {
      navigate("/"); // Redirect to homepage if no cart is found or cart is empty
      return;
    }
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      const productIds = cart.map((item) => item.productId);

      fetch("http://localhost:5001/get-cart-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds }),
      })
        .then((response) => response.json())
        .then((data) => {
          const mergedProducts = data.map((product) => {
            const foundItem = cart.find(
              (item) => item.productId === product._id
            );
            return {
              ...product,
              quantity: foundItem ? foundItem.quantity : 0, // Default to 0 if not found, adjust as necessary
            };
          });
          verifyStock(mergedProducts);
          setProducts(mergedProducts);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [navigate]);

  const verifyStock = (products) => {
    fetch("http://localhost:5001/check-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: products.map((product) => ({
          productId: product._id,
          quantity: product.quantity,
        })),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response status code is not OK, handle it as an error
          return response.json().then((data) => {
            throw new Error(
              data.message || "Stock verification failed. Please try again."
            );
          });
        }
        return response.json(); // Proceed to process the successful response
      })
      .then((data) => {
        // If this block is reached, it means the HTTP status was OK (200, 201, etc.)
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch or in the processing chain
        alert(error.message);
        navigate("/cart");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const total = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <div className="flex justify-center space-x-8  mx-auto mt-5">
      <div className="w-2/6 p-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Checkout Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="fullName">
              Full Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="email">
              Email
            </label>
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
            <label className="block mb-2 font-bold" htmlFor="address">
              Address
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold" htmlFor="phone">
              Phone
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </div>

      {/* Order Summary Table */}
      <div className="w-3/5 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b">
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>Pkr{product.price.toFixed(2)}</td>
                <td>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
              </tr>
            ))}
            <tr className="mt-5">
              <td colSpan="3" className="font-bold">
                Total
              </td>
              <td className="font-bold">Pkr{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <button
          className="w-1/7 py-2 justify-end px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-5 w-auto whitespace-nowrap"
          onClick={handleSubmit}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CheckoutForm;
