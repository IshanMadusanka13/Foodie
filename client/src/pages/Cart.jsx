import React from 'react';

const Cart = ({ cartItems, onClearCart }) => {
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="text-black divide-y divide-gray-200">
            {isCartEmpty ? (
                <p className="p-4 text-gray-500">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="p-2">
                        {cartItems.map((item) => (
                            <li key={item.itemId} className="py-3">
                                <div className="flex justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.restaurantName}</p>
                                    </div>
                                    <div className="ml-4 text-right">
                                        <p className="text-gray-700">
                                            ${item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                        <p className="font-semibold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={onClearCart}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
                            >
                                Clear Cart
                            </button>
                            <button
                                className="flex-1 bg-primary-500 text-white py-2 rounded hover:bg-primary-600 transition"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;