import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Cart = ({ cartItems, onClearSelected, onQuantityChange, darkMode = false }) => {
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
        <div className={`divide-y ${darkMode ? 'divide-gray-600 text-white' : 'divide-gray-200 text-black'}`}>
            {isCartEmpty ? (
                <p className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your cart is empty.</p>
            ) : (
                <>
                    <div className={`flex items-center px-4 py-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className="mr-2"
                        />
                        <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select All</label>
                    </div>

                    <ul className="p-2">
                        {cartItems.map((item) => (
                            <li key={item.itemId} className="py-3 flex items-start justify-between">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.itemId)}
                                    onChange={() => toggleSelect(item.itemId)}
                                    className={`mr-2 mt-2 ${darkMode ? 'accent-primary-500' : ''}`}
                                />
                                <div className="flex-1">
                                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.restaurantName}</p>
                                </div>
                                <div className="ml-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onQuantityChange(item.itemId, -1)}
                                            className={`px-2 py-1 border rounded ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-200 border-gray-300 text-black'}`}
                                        >
                                            -
                                        </button>
                                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{item.quantity}</span>
                                        <button
                                            onClick={() => onQuantityChange(item.itemId, 1)}
                                            className={`px-2 py-1 border rounded ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-200 border-gray-300 text-black'}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        ${item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className={`p-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className={`flex justify-between font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                            <span>Total:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleClearSelected}
                                className={`flex-1 py-2 rounded transition ${darkMode
                                        ? selectedItems.length === 0
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-600 text-white hover:bg-gray-500'
                                        : selectedItems.length === 0
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                disabled={selectedItems.length === 0}
                            >
                                Clear
                            </button>
                            <button className={`flex-1 bg-primary-500 text-white py-2 rounded hover:bg-primary-600 transition ${darkMode ? 'hover:bg-primary-700' : ''
                                }`}>
                                Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

Cart.propTypes = {
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            itemId: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            restaurantName: PropTypes.string,
            price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
        })
    ).isRequired,
    onClearSelected: PropTypes.func.isRequired,
    onQuantityChange: PropTypes.func.isRequired,
    darkMode: PropTypes.bool,
};

Cart.defaultProps = {
    darkMode: false,
};

export default Cart;