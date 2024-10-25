import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const { cart, updateCart } = useCart();
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart || cart === "[]") {
      setProducts([]);
      return; // Early return if no cart is found or cart is empty
    }
    if (cart.length === 0) {
      setProducts([]); // Set products to empty if the cart has no products
      return;
    }
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
          const foundItem = cart.find((item) => item.productId === product._id);
          return {
            ...product,
            quantity: foundItem ? foundItem.quantity : 1, // Default to 1 if not found
          };
        });
        setProducts(mergedProducts);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    updateCart(productId, newQuantity);
  };
  const removeFromCart = (productId) => {
    updateCart(productId, 0);
  };
  return (
    <div>
      {/* Centered Button */}
      <div className="flex justify-center mt-4 space-x-4">
        <a
          href="/inventory"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          All Services & Product
        </a>
        <a
          href="/orders"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Orders
        </a>
        <a
          href="/InventoryCategory"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Categories
        </a>
        <a
          href="/AddProduct"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Product
        </a>
        <a
          href="/AddCategory"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Category
        </a>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <p className="text-center mt-5 mb-5 text-xl p-5">No items in cart</p>
      ) : (
        <>
          <div className="mt-4 flex justify-center">
            <table className="table-auto w-full lg:w-4/5 xl:w-3/4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-2">Image</th>
                  <th className="px-2 py-2">Product Name</th>
                  <th className="px-2 py-2">Total Items</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-2 py-2 text-center">
                      <img
                        width="100px"
                        height="100px"
                        src={product.images[0]}
                      />
                    </td>
                    <td className="px-2 py-2 text-center">{product.name}</td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            product._id,
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">{product.price}</td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="bg-red-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded w-auto whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href="/checkout"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
