import React, { useState, useEffect } from 'react';

const Cart = ({ cartItems, onClearSelected, onQuantityChange}) => {
    const [selectedItems, setSelectedItems] = useState([]);

    // Automatically update selection if cartItems change
    useEffect(() => {
        setSelectedItems((prevSelected) =>
            prevSelected.filter((id) => cartItems.some((item) => item.itemId === id))
        );
    }, [cartItems]);

    const toggleSelect = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleClearSelected = () => {
        onClearSelected(selectedItems);
        setSelectedItems([]);
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]); // Deselect all
        } else {
            setSelectedItems(cartItems.map((item) => item.itemId)); // Select all
        }
    };

    const isAllSelected = selectedItems.length === cartItems.length && cartItems.length > 0;
    const isCartEmpty = cartItems.length === 0;

    const calculateTotal = () =>
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="text-black divide-y divide-gray-200">
            {isCartEmpty ? (
                <p className="p-4 text-gray-500">Your cart is empty.</p>
            ) : (
                <>
                    <div className="flex items-center px-4 py-2 border-b border-gray-200">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="mr-2"
                        />
                        <label className="text-sm text-gray-700">Select All</label>
                    </div>

                    <ul className="p-2">
                        {cartItems.map((item) => (
                            <li key={item.itemId} className="py-3 flex items-start justify-between">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.itemId)}
                                    onChange={() => toggleSelect(item.itemId)}
                                    className="mr-2 mt-2"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.restaurantName}</p>
                                </div>
                                <div className="ml-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onQuantityChange(item.itemId, -1)}
                                            className="px-2 py-1 border rounded bg-gray-200"
                                        >
                                            -
                                        </button>
                                        <span className="font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => onQuantityChange(item.itemId, 1)}
                                            className="px-2 py-1 border rounded bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-gray-700">
                                        ${item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                    <p className="font-semibold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
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
                                onClick={handleClearSelected}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
                                disabled={selectedItems.length === 0}
                            >
                                Clear
                            </button>
                            <button className="flex-1 bg-primary-500 text-white py-2 rounded hover:bg-primary-600 transition">
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
