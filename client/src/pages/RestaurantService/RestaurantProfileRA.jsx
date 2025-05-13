import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../utils/fetchapi';
import MenuItemList from '../MenuItemService/MenuItemList';

const RestaurantProfileRA = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('menu');
    const [menuItems, setMenuItems] = useState([]);

    // Cart state
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

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'menu':
                return (
                    <MenuItemList
                        restaurantId={id}
                        menuItems={menuItems}
                        quantities={quantities}
                        onQuantityChange={handleQuantityChange}
                    />
                );
            default:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold">Overview</h2>
                        <p>{restaurant.description}</p>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white">
            <div className="flex flex-col items-center">
                {/* Restaurant Header Section */}
                <div className="flex justify-between gap-6">
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

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 max-w-6xl mx-auto px-6">                    
                    <button
                        onClick={() => setActiveSection('menu')}
                        className={`py-4 px-1 font-medium text-sm border-b-2 ${activeSection === 'menu'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Menu
                    </button>                    
                </nav>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6">
                {renderSectionContent()}
            </div>
        </div>
    );
};

export default RestaurantProfileRA;