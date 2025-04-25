import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { api } from '../../utils/fetchapi';
import { SearchIcon } from '@heroicons/react/solid';  // Import the search icon from Heroicons
import { Pencil, Trash2 } from 'lucide-react';
import EditMenuItem from './EditMenuItem';  // Import EditMenuItem

const MenuItemCategory = ({ restaurantId }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [notFoundMessage, setNotFoundMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

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

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const res = await api.getMenuItemsByRestaurant(restaurantId);
                setMenuItems(res?.data?.items || []);
                setFilteredItems(res?.data?.items || []);  // Initialize filtered items
            } catch (err) {
                console.error(err);
                setError('Failed to load menu items');
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) fetchMenuItems();
    }, [restaurantId]);

    useEffect(() => {
        if (searchId) {
            // Real-time search: Filter items based on search input
            const filtered = menuItems.filter((item) =>
                item.name.toLowerCase().includes(searchId.toLowerCase())
            );
            setFilteredItems(filtered);

            // Show message if no results are found
            if (filtered.length === 0) {
                setNotFoundMessage('No matching menu items found!');
            } else {
                setNotFoundMessage('');
            }
        } else {
            setFilteredItems(menuItems); // Show all items if search is cleared
            setNotFoundMessage('');
        }
    }, [searchId, menuItems]);

    if (loading) return <div>Loading menu items...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!menuItems.length) return <div>No menu items available.</div>;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Menu</h2>
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Find Something delicious 🤤"
                        className="border border-gray-300 rounded p-2 text-gray-700 placeholder-gray-400 flex-1 sm:w-64"
                    />
                    <button
                        onClick={() => { }} // Optional: Handle search explicitly if needed
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
                    >
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Display not found message */}
            {notFoundMessage && <div className="text-red-500 mb-4">{notFoundMessage}</div>}

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-3 py-4 mb-6 border-b border-gray-200 overflow-x-auto">
                {/* Optional: 'All' button to reset filter */}
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
                                ? 'bg-blue-600 text-white border-blue-700 shadow-md'
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
                                        ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                <span className="text-xs sm:text-sm">{cat.name}</span>
                            </button>
                        );
                    })}
            </div>

            {/* Responsive Item Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col"
                    >
                        <h3 className="mb-2 text-lg sm:text-xl font-semibold text-black">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <p className="text-green-600 font-bold mt-2">${item.price.toFixed(2)}</p>
                        {item.imageUrls?.length > 0 && (
                            <img
                                src={item.imageUrls[0]}
                                alt={item.name}
                                className="mt-4 w-full h-40 sm:h-48 object-cover rounded"
                            />
                        )}
                        <p className={`mt-2 text-sm ${item.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                            {item.isAvailable ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Prop validation for restaurantId
MenuItemCategory.propTypes = {
    restaurantId: PropTypes.string.isRequired,  // Expecting a string for restaurantId
};

export default MenuItemCategory;
