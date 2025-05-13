import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../utils/fetchapi';
import MenuItemList from '../MenuItemService/MenuItemList';
import { ThemeContext } from '../../contexts/ThemeContext';

const RestaurantProfileRA = () => {
    const { id } = useParams();
    const { darkMode } = useContext(ThemeContext);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (itemId, change) => {
        setQuantities((prev) => {
            const newQuantities = { ...prev };
            const newQuantity = (newQuantities[itemId] || 0) + change;
            newQuantities[itemId] = Math.max(newQuantity, 0);
            return newQuantities;
        });
    };

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await api.getRestaurantById(id);
                setRestaurant(res?.data?.restaurant);

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

    if (loading) return (
        <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    if (error) return (
        <div className={`p-8 ${darkMode ? 'bg-gray-900 text-red-400' : 'text-red-500'}`}>
            {error}
        </div>
    );

    if (!restaurant) return (
        <div className={`p-8 ${darkMode ? 'bg-gray-900 text-gray-300' : 'text-gray-700'}`}>
            Restaurant not found
        </div>
    );

    return (
        <div className={darkMode ? 'bg-gray-900' : 'border-t bg-white'}>
            <div className="flex flex-col items-center">
                {/* Restaurant Header Section */}
                <div className="flex justify-between gap-6 p-4">
                    <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                        {restaurant.name}
                    </h1>
                    {/* Restaurant Info */}
                    <div>
                        <p className={`px-3 py-1 rounded-full text-md mb-4 border ${restaurant.isOpen
                                ? darkMode
                                    ? 'border-green-400 text-green-400'
                                    : 'border-green-500 text-green-500'
                                : darkMode
                                    ? 'border-red-400 text-red-400'
                                    : 'border-red-500 text-red-500'
                            }`}>
                            {restaurant.isOpen ? 'Open now' : 'Closed'} — {restaurant.openTime} to {restaurant.closeTime}
                        </p>
                    </div>
                </div>
                {/* Restaurant Images */}
                <div className="flex space-x-4 overflow-x-auto pb-4 px-4">
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

            {/* Main Content - MenuItemList rendered directly */}
            <div className={`max-w-6xl mx-auto p-6 ${darkMode ? 'bg-gray-900' : 'border-t bg-white'}`}>
                <MenuItemList
                    restaurantId={id}
                    menuItems={menuItems}
                    quantities={quantities}
                    onQuantityChange={handleQuantityChange}
                />
            </div>
        </div>
    );
};

export default RestaurantProfileRA;