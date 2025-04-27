import { useEffect, useState } from 'react';
import api from '../utils/fetchapi';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    HomeIcon,
    ShoppingBagIcon,
    ClockIcon,
    UserIcon,
    CogIcon,
    SearchIcon,
    ChevronLeftIcon, 
    ChevronRightIcon
} from '@heroicons/react/solid';
import { FaMapMarkerAlt, FaShoppingCart, FaUtensils } from "react-icons/fa";
import Cart from './Cart'; 
import RestaurantList from './RestaurantService/RestaurantList';

const CustomerDashboard = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [notFoundMessage, setNotFoundMessage] = useState('');
    const [restaurantMap, setRestaurantMap] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [location, setLocation] = useState("Samanala Uyana Road, Malabe");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [quantities, setQuantities] = useState({});
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

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

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                const [menuRes, restaurantRes] = await Promise.all([
                    api.getAllMenuItems(),
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

        fetchData();
    }, []);

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchId, selectedCategory]);

    if (loading) return <div>Loading menu items...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!menuItems.length) return <div>No menu items available.</div>;

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <>
                        {/* dashboard content */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                            <div className="p-4 bg-white">
                                {/* Location and Search Section */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                                    <div className="flex items-center space-x-4 bg-white px-6 py-4 shadow-md w-full md:w-1/2">
                                        <FaMapMarkerAlt className="text-primary-500 mr-2" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">{location}</p>
                                        </div>
                                        <button className="text-primary-500 text-sm font-semibold">Change</button>
                                    </div>

                                    <div className="flex items-center space-x-4 w-full md:w-1/2">
                                        <input
                                            type="text"
                                            value={searchId}
                                            onChange={(e) => setSearchId(e.target.value)}
                                            placeholder="Find Something delicious 🤤"
                                            className="border border-gray-300 rounded p-2 text-gray-700 placeholder-gray-400 w-full"
                                        />
                                        <button className="bg-primary-500 text-white p-2 rounded hover:bg-primary-900 flex items-center">
                                            <SearchIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Category Buttons */}
                                <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-4 mb-6 border-b border-gray-200 overflow-x-auto">
                                    {menuItems.length > 0 && (
                                        <button
                                            onClick={() => {
                                                setFilteredItems(menuItems);
                                                setSelectedCategory('');
                                                setNotFoundMessage('');
                                            }}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 min-w-fit rounded-3xl text-sm font-medium
                                                transition duration-200 border shadow-sm
                                                ${!selectedCategory
                                                    ? 'bg-gray-200 border-primary-400 border-2 text-black border-blue-700 shadow-md'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-150'}
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
                                                    flex items-center gap-2 px-4 py-2 min-w-fit rounded-3xl text-sm font-medium
                                                    transition duration-200 border shadow-sm
                                                    ${isSelected
                                                            ? 'bg-gray-200 border-primary-400 border-2 text-black border-blue-700 shadow-md'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-150'}
                                                    `}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-lg">{cat.icon}</span>
                                                        <span className="text-xs sm:text-sm">{cat.name}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                </div>

                                {notFoundMessage && <div className="text-red-500 mb-4">{notFoundMessage}</div>}

                                {/* Menu Items */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedItems.map((item) => (
                                        <div key={item._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xl text-black font-semibold">{item.name}</h3>
                                                <h3 className="text-primary-600 font-bold">
                                                    {restaurantMap[item.restaurantId?._id] || 'Unknown Restaurant'}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600">{item.description}</p>
                                            <p className="text-green-600 font-bold mt-2">${item.price.toFixed(2)}</p>
                                            {item.imageUrls?.length > 0 && (
                                                <img
                                                    src={item.imageUrls[0]}
                                                    alt={item.name}
                                                    className="mb-2 mt-4 w-full h-48 object-cover rounded"
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

                                {/* Pagination */}
                                <div className="flex justify-center items-center gap-4 mt-8">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-primary-500 text-white rounded disabled:opacity-50"
                                    >
                                        <ChevronLeftIcon className="h-6 w-6" />
                                    </button>

                                    <span className="text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-primary-500 text-white rounded disabled:opacity-50"
                                    >
                                        <ChevronRightIcon className="h-6 w-6" />
                                    </button>
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
                        </div>
                    </>
                );
            case 'restaurants':
                return (
                    <div className="p-6">
                        <RestaurantList/>
                    </div>
                );
            case 'history':
                return (
                    <div className="p-6">
                        {/* Add your order history content here */}
                    </div>
                );
            case 'profile':
                return (
                    <div className="p-6">
                        {/* Add your profile content here */}
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-6">
                        {/* Add your Settings content here */}
                    </div>
                );
            default:
                return <div>Select a view</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Collapsible Sidebar */}
            <div className={`bg-white shadow-md ${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
                    {!sidebarCollapsed && <h2 className="text-xl font-bold text-primary-600">Foodie</h2>}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                        {sidebarCollapsed ?
                            <ChevronDoubleRightIcon className="h-5 w-5" /> :
                            <ChevronDoubleLeftIcon className="h-5 w-5" />
                        }
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="p-2">
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => setActiveView('dashboard')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'dashboard' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <HomeIcon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>Dashboard</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('restaurants')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'restaurants' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <FaUtensils className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>Restaurants</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('history')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'history' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <ClockIcon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>Order History</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('profile')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'profile' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <UserIcon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>User Profile</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('settings')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'settings' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <CogIcon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>Settings</span>}
                            </button>
                        </li>
                    </ul>
                </nav>                                    
            </div>

            <div className="flex-1 overflow-auto">
                {renderActiveView()}
            </div>  

        </div>
    );
};

export default CustomerDashboard;

       