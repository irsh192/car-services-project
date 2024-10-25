import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; 



const Orders = () => {
  const { isSuperuser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Extract user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.id;
    const isSuperuser = userData.is_superuser;
    let url = 'http://localhost:5001/orders';
    if (!isSuperuser) {
        url += `?userId=${userId}`;
    }

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        setOrders(data);
    })
    .catch(error => console.error('Error fetching orders:', error));
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div>

      {/* Centered Button */}
      <div className="flex justify-center mt-4 space-x-4">
        {isSuperuser && (
          <>
          <a href="/inventory" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          All Services & Product
          </a>
          <a href="/all-categories" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Categories
          </a>
          <a href="/AddProduct" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
        <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Orders
        </a>
      </div>

      {/* Products Table */}
      <div className="mt-4 flex justify-center">
        <table className="table-auto w-full lg:w-4/5 xl:w-3/4">
          <thead className="bg-gray-200">
            <tr style={{ textAlign: 'left' }}>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
                <td className="px-4 py-2">{index+1}</td>
                <td className="px-4 py-2">{order.user.name}</td>
                <td className="px-4 py-2">{order.user.email}</td>
                <td className="px-4 py-2">Pkr{order.total.toFixed(2)}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">
                    <a onClick={() => handleViewDetails(order)} className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">View</a>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-3xl leading-6 font-medium text-gray-900">Order Details</h3>
              <div className="mt-2 px-7 py-3">
              <div style={{ textAlign: 'left' }}>
                <p><b>Name:</b> {selectedOrder.user.name}</p>
                <p><b>Email:</b> {selectedOrder.user.email}</p>
                <p><b>Address:</b> {selectedOrder.user.address}</p>
                <p><b>Total:</b> Pkr{selectedOrder.total.toFixed(2)}</p>
              </div>
                <div className="mt-4">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr style={{ textAlign: 'left' }}>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((item, idx) => (
                        <tr key={idx} style={{ textAlign: 'left' }}>
                          <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                            {item.name}
                          </td>
                          <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                            {item.quantity}
                          </td>
                          <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                            Pkr{item.price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;