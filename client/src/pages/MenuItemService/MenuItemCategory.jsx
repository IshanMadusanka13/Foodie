import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../utils/fetchapi';
import { SearchIcon } from '@heroicons/react/solid';
import { ThemeContext } from '../../contexts/ThemeContext';

const MenuItemCategory = ({
    restaurantId,
    quantities,
    onQuantityChange,
    cart,
    setCart,
    showCart,
    setShowCart
}) => {
    const { darkMode, setTheme } = useContext(ThemeContext);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [notFoundMessage, setNotFoundMessage] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [restaurantMap, setRestaurantMap] = useState({});
    const [currentRestaurantName, setCurrentRestaurantName] = useState('');

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
        const fetchData = async () => {
            try {
                const [menuRes, restaurantRes, currentRestaurantRes] = await Promise.all([
                    api.getMenuItemsByRestaurant(restaurantId),
                    api.getRestaurantById(restaurantId)
                ]);

                const menuData = menuRes?.data?.items || [];
                const currentRestaurant = currentRestaurantRes?.data?.restaurant || {};

                setCurrentRestaurantName(currentRestaurant.name || '');
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
        } else if (selectedCategory) {
            const filtered = menuItems.filter(item => item.category === selectedCategory);
            setFilteredItems(filtered);
        } else {
            setFilteredItems(menuItems);
            setNotFoundMessage('');
        }
    }, [searchId, menuItems, selectedCategory]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
        </div>
    );

    if (!menuItems.length) return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-blue-700">No menu items available for this restaurant.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="text-gray-900 dark:text-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 mt-4">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 mr-4 sm:mb-0 text-black dark:text-white">
                    Menu
                </h2>                
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Find Something delicious 🤤"
                        className={`border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-700 placeholder-gray-400'} rounded p-2 w-full`}
                        />
                    <button
                        onClick={() => { }}
                        className={`bg-primary-500 text-white p-2 rounded hover:bg-primary-600 flex items-center justify-center border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-700'} rounded p-2`}
                    >
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {notFoundMessage && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300">
                    <p>{notFoundMessage}</p>
                </div>
            )}

            <div className="flex flex-wrap gap-3 py-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
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
                            ? 'bg-primary-500 text-white border-primary-700 shadow-md hover:bg-primary-600'
                            : 'bg-gray-100 dark:bg-gray-700 text-black dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'}
                        `}
                    >
                        <span className="text-lg">🍽️</span>
                        <span className="text-black !important dark:text-white !important">
                            All
                        </span>
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
                                        ? 'bg-primary-500 text-white border-primary-700 shadow-md hover:bg-primary-600'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'}
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
                        className={`bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                        >
                        <h3 className={`mb-2 text-lg sm:text-xl font-semibold text-black ${darkMode ? 'text-white' : 'text-black'}`}>{item.name}</h3>    
                        <p className={`text-sm  ${darkMode ? 'text-gray-500' : 'text-black'}`}>{item.description}</p>
                        <p className={`font-bold mt-2 ${darkMode ? 'text-white' : 'text-green-600 '}`}>${item.price.toFixed(2)}</p>
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
                                <div className="bg-neutral-light dark:bg-neutral-dark text-black dark:text-white flex items-center border border-gray-300 dark:border-neutral-dark rounded-lg">
                                    <button
                                        onClick={() => onQuantityChange(item._id, -1)}
                                        className="px-3 py-1 border-r border-gray-300 dark:border-neutral dark:text-white"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 text-lg font-semibold border-r border-gray-300 dark:border-neutral">
                                        {quantities[item._id]}
                                    </span>
                                    <button
                                        onClick={() => onQuantityChange(item._id, 1)}
                                        className="px-3 py-1 text-black dark:text-white"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => onQuantityChange(item._id, 1)}
                                    className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
                                >
                                    Add +
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

MenuItemCategory.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    quantities: PropTypes.object.isRequired,
    onQuantityChange: PropTypes.func.isRequired,
    cart: PropTypes.array.isRequired,
    setCart: PropTypes.func.isRequired,
    showCart: PropTypes.bool.isRequired,
    setShowCart: PropTypes.func.isRequired,
};

export default MenuItemCategory;