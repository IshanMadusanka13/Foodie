import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../utils/fetchapi';
import MenuItemCategory from '../MenuItemService/MenuItemCategory';
import { FaShoppingCart } from "react-icons/fa";
import Cart from '../Cart';
import { usePersistedCart } from '../../hooks/usePersistedCart';
import { ThemeContext } from '../../contexts/ThemeContext';

const RestaurantProfile = () => {
    const { id } = useParams();
    const { darkMode, setTheme } = useContext(ThemeContext);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [menuItems, setMenuItems] = useState([]);

    // Cart state
    const [quantities, setQuantities] = useState({});
    const [cart, setCart, clearSelectedItems] = usePersistedCart('cart', []);
    const [showCart, setShowCart] = useState(false);

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
                            restaurantId: id,
                            restaurantName: restaurant?.name || 'Unknown Restaurant',
                        },
                    ];
                }
            });

            return newQuantities;
        });
    };

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await api.getRestaurantById(id);
                setRestaurant(res?.data?.restaurant);

                // Fetch menu items for this restaurant
                const menuRes = await api.getMenuItemsByRestaurant(id);
                setMenuItems(menuRes?.data?.items || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load restaurant profile');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
        const intervalId = setInterval(fetchRestaurant, 60000);
        return () => clearInterval(intervalId);
    }, [id]);

    if (loading) return <div className="p-8 text-lg">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!restaurant) return <div className="p-8">Restaurant not found</div>;

    return (
        <div className={`px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'border-t bg-white'}`}>
            <div className="flex flex-col items-center">
                {/* Restaurant Header Section */}
                <div className="flex justify-between gap-6 mt-4">
                    <h1 className="text-primary-600 text-4xl font-bold mb-2">{restaurant.name}</h1>
                    {/* Restaurant Info */}
                    <div>
                        <p className={`px-3 py-1 rounded-full text-md mb-4 border ${restaurant.isOpen
                            ? 'border-green-500 text-green-500'
                            : 'border-red-500 text-red-500'
                            }`}>
                            {restaurant.isOpen ? 'Open now' : 'Closed'} — {restaurant.openTime} to {restaurant.closeTime}
                        </p>
                    </div>
                </div>
                {/* Restaurant Images */}
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {restaurant.imageUrls?.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Restaurant ${index}`}
                            className="min-w-[500px] min-h-[300px] w-48 h-48 object-cover rounded-lg shadow"
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6">
            <MenuItemCategory
                    restaurantId={id}
                    quantities={quantities}
                    onQuantityChange={handleQuantityChange}
                    cart={cart}
                    setCart={setCart}
                    showCart={showCart}
                    setShowCart={setShowCart}
                />
            </div>

            {/* Cart Icon - Fixed position */}
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
                    <div className={`bg-white p-6 rounded-lg w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-primary-600 text-xl font-bold">Cart</h2>
                            <button
                                onClick={() => setShowCart(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        <Cart
                            cartItems={cart}
                            onClearSelected={clearSelectedItems}
                            onQuantityChange={handleQuantityChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantProfile;