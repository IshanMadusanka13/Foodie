import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { darkMode } = useContext(ThemeContext);
  
  // Use dummy data as fallback if no state is passed
  const dummyData = {
    restaurantId: 'rest123',
    restaurantName: 'Delicious Bites',
    restaurantLocation: { longitude: -73.9857, latitude: 40.7484 },
    restaurantAddress: '123 Foodie Ave, New York, NY 10001',
    deliveryDistance: '2.5', // Added delivery distance
    items: [
      { menuItemId: 'item1', menuItemName: 'Chicken Burger', menuItemPrice: 8.99, qty: 2 },
      { menuItemId: 'item2', menuItemName: 'French Fries', menuItemPrice: 3.99, qty: 1 },
      { menuItemId: 'item3', menuItemName: 'Soda', menuItemPrice: 1.99, qty: 2 }
    ]
  };

  // Get order details from location state or use dummy data
  const orderDetails = location.state?.orderDetails || dummyData;
  
  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Calculate subtotal, delivery fee, and total
  const subtotal = orderDetails.items.reduce((sum, item) => {
    return sum + (item.menuItemPrice * item.qty);
  }, 0);
  
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Handle order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOrderComplete(true);
      
      // In a real app, you would send order to backend here
      console.log('Order submitted:', {
        user: currentUser?.email,
        restaurant: orderDetails.restaurantName,
        items: orderDetails.items,
        paymentMethod,
        subtotal,
        deliveryFee,
        total
      });
    }, 2000);
  };

  // Reset to homepage after order completion
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        <div className={`max-w-4xl mx-auto rounded-xl shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} p-6`}>
          {orderComplete ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto ${darkMode ? 'text-green-500' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="mt-4 text-2xl font-bold">Order Placed Successfully!</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your order has been placed and will be delivered shortly.
              </p>
              <button 
                onClick={handleBackToHome}
                className={`mt-6 py-2 px-6 ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-500 hover:bg-primary-600'} text-white font-bold rounded-xl transition duration-200`}
              >
                Back to Home
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Order</h1>

              {/* Restaurant Information */}
              <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <h2 className="text-xl font-semibold">{orderDetails.restaurantName}</h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{orderDetails.restaurantAddress}</p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Delivery Distance: {orderDetails.deliveryDistance} miles</p>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <table className="w-full">
                    <thead className={`${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                      <tr>
                        <th className="py-2 px-4 text-left">Item</th>
                        <th className="py-2 px-4 text-right">Qty</th>
                        <th className="py-2 px-4 text-right">Price</th>
                        <th className="py-2 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.items.map((item) => (
                        <tr key={item.menuItemId} className={`border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                          <td className="py-3 px-4">{item.menuItemName}</td>
                          <td className="py-3 px-4 text-right">{item.qty}</td>
                          <td className="py-3 px-4 text-right">${item.menuItemPrice.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">${(item.menuItemPrice * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className={`p-4 mb-6 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-300">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmitOrder}>
                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
                  <div className="flex flex-col space-y-3">
                    <label className={`flex items-center p-3 rounded-lg cursor-pointer ${
                      paymentMethod === 'cash' 
                        ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-100 border-green-500') 
                        : (darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-50')
                    } border`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={handlePaymentMethodChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Pay when your order arrives</div>
                      </div>
                    </label>

                    <label className={`flex items-center p-3 rounded-lg cursor-pointer ${
                      paymentMethod === 'card' 
                        ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-100 border-green-500') 
                        : (darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-50')
                    } border`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={handlePaymentMethodChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Card Payment</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Pay now with your credit/debit card</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 ${
                    darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-500 hover:bg-primary-600'
                  } text-white font-bold rounded-xl transition duration-200 flex justify-center ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    `Place Order - $${total.toFixed(2)}`
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;