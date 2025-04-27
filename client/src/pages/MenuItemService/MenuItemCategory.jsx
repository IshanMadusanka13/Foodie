import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../utils/fetchapi';
import { SearchIcon } from '@heroicons/react/solid';
import { FaShoppingCart } from "react-icons/fa";
import Cart from '../Cart';

const MenuItemCategory = ({ restaurantId }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [notFoundMessage, setNotFoundMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [quantities, setQuantities] = useState({});
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [restaurantMap, setRestaurantMap] = useState({});

    const categories = [
        { name: 'Appetizers', icon: '🥟' },
        { name: 'Salads', icon: '🥗' },
        { name: 'Main Course', icon: '🍛' },
        { name: 'Pizzas', icon: '🍕' },
        { name: 'Burgers & Sandwiches', icon: '🍔' },
        { name: 'Asian Specials', icon: '🍜' },
        { name: 'Mexican', icon: '🌮' },
        { name: 'Beverages', icon: '🍹' },
        { name: 'Desserts', icon: '🍰' },
    ];

    const handleQuantityChange = (itemId, change) => {
        setQuantities((prev) => {
            const newQuantities = { ...prev };
            const newQuantity = (newQuantities[itemId] || 0) + change;
            newQuantities[itemId] = Math.max(newQuantity, 0);

            // Update the cart
            setCart((prevCart) => {
                const item = menuItems.find((item) => item._id === itemId);
                if (!item) return prevCart;

                if (newQuantity === 0) {
                    return prevCart.filter((cartItem) => cartItem.itemId !== itemId);
                }

                const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.itemId === itemId);

                if (existingItemIndex >= 0) {
                    const updatedCart = [...prevCart];
                    updatedCart[existingItemIndex] = {
                        ...updatedCart[existingItemIndex],
                        quantity: newQuantity,
                    };
                    return updatedCart;
                } else {
                    return [
                        ...prevCart,
                        {
                            itemId,
                            name: item.name,
                            price: item.price,
                            quantity: newQuantity,
                            restaurantName: restaurantMap[item.restaurantId?._id] || 'Unknown Restaurant',
                        },
                    ];
                }
            });

            return newQuantities;
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuRes, restaurantRes] = await Promise.all([
                    api.getMenuItemsByRestaurant(restaurantId),
                    api.getAllRestaurants()
                ]);

                const menuData = menuRes?.data?.items || [];
                const restaurantData = restaurantRes?.data?.restaurants || [];

                const map = {};
                restaurantData.forEach((r) => {
                    map[r._id] = r.name;
                });

                setRestaurantMap(map);
                setMenuItems(menuData);
                setFilteredItems(menuData);
            } catch (err) {
                console.error(err);
                setError('Failed to load menu items');
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) fetchData();
    }, [restaurantId]);

    useEffect(() => {
        if (searchId) {
            const filtered = menuItems.filter((item) =>
                item.name.toLowerCase().includes(searchId.toLowerCase())
            );
            setFilteredItems(filtered);
            setNotFoundMessage(filtered.length === 0 ? 'No matching menu items found!' : '');
        } else {
            setFilteredItems(menuItems);
            setNotFoundMessage('');
        }
    }, [searchId, menuItems]);

    if (loading) return <div>Loading menu items...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!menuItems.length) return <div>No menu items available.</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 mr-4 sm:mb-0">Menu</h2>
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Find Something delicious 🤤"
                        className="border border-gray-300 rounded p-2 text-gray-700 placeholder-gray-400 flex-1 sm:w-64"
                    />
                    <button
                        onClick={() => { }}
                        className="bg-primary-500 text-white p-2 rounded hover:bg-primary-600 flex items-center justify-center"
                    >
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {notFoundMessage && <div className="text-red-500 mb-4">{notFoundMessage}</div>}

            <div className="flex flex-wrap gap-3 py-4 mb-6 border-b border-gray-200 overflow-x-auto">
                {menuItems.length > 0 && (
                    <button
                        onClick={() => {
                            setFilteredItems(menuItems);
                            setSelectedCategory('');
                            setNotFoundMessage('');
                        }}
                        className={`
                            flex items-center gap-2 px-4 py-2 min-w-fit rounded-full text-sm font-medium 
                            transition duration-200 border shadow-sm
                            ${!selectedCategory
                                ? 'bg-primary-500 text-white border-primary-700 shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                        `}
                    >
                        <span className="text-lg">🍽️</span>
                        <span className="text-xs sm:text-sm">All</span>
                    </button>
                )}

                {categories
                    .filter(cat => menuItems.some(item => item.category === cat.name))
                    .map((cat) => {
                        const isSelected = selectedCategory === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => {
                                    setSearchId('');
                                    setSelectedCategory(cat.name);
                                    const filtered = menuItems.filter(item => item.category === cat.name);
                                    setFilteredItems(filtered);
                                    setNotFoundMessage(filtered.length ? '' : `No items found in "${cat.name}" category.`);
                                }}
                                className={`
                                    flex items-center gap-2 px-4 py-2 min-w-fit rounded-full text-sm font-medium 
                                    transition duration-200 border shadow-sm
                                    ${isSelected
                                        ? 'bg-primary-500 text-white border-primary-700 shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                    `}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                <span className="text-xs sm:text-sm">{cat.name}</span>
                            </button>
                        );
                    })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="mb-2 text-lg sm:text-xl font-semibold text-black">{item.name}</h3>
                            <span className="text-primary-600 font-bold">
                                {restaurantMap[item.restaurantId?._id] || 'Unknown Restaurant'}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <p className="text-green-600 font-bold mt-2">${item.price.toFixed(2)}</p>
                        {item.imageUrls?.length > 0 && (
                            <img
                                src={item.imageUrls[0]}
                                alt={item.name}
                                className="mt-4 w-full h-40 sm:h-48 object-cover rounded"
                            />
                        )}

                        <div className="flex justify-between items-center mt-4">
                            <p className={`text-sm ${item.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                {item.isAvailable ? 'Available' : 'Not Available'}
                            </p>

                            {quantities[item._id] > 0 ? (
                                <div className="bg-gray-200 text-black flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(item._id, -1)}
                                        className="px-3 py-1 border-r border-gray-300 text-black"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 text-lg font-semibold border-r border-gray-300">
                                        {quantities[item._id]}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(item._id, 1)}
                                        className="px-3 py-1 text-black"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleQuantityChange(item._id, 1)}
                                    className="bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-700 text-sm font-semibold"
                                >
                                    Add +
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Icon */}
            <div
                className="fixed bottom-4 right-4 bg-primary-500 text-white p-3 rounded-full shadow-lg cursor-pointer"
                onClick={() => setShowCart(!showCart)}
            >
                <FaShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                )}
            </div>

            {/* Cart Modal */}
            {showCart && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-primary-600 text-xl font-bold">Cart</h2>
                            <button
                                onClick={() => setShowCart(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        <Cart cartItems={cart} />
                    </div>
                </div>
            )}
        </div>
    );
};

MenuItemCategory.propTypes = {
    restaurantId: PropTypes.string.isRequired,
};

export default MenuItemCategory;