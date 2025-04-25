import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../utils/fetchapi';
import MenuItemList from '../../pages/MenuItemService/MenuList';
import backgroundImage from '../../assets/hero.jpg';
import MenuItemCategory from '../MenuItemService/MenuItemCategory';

const RestaurantProfile = () => {
    const { id } = useParams();
    console.log("Restaurant ID from URL:", id); 
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('menu'); // Track active section

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await api.getRestaurantById(id);
                console.log("Fetched restaurant data:", res?.data); // Debug line
                setRestaurant(res?.data?.restaurant);
            } catch (err) {
                console.error(err);
                console.error("API error:", err); // Debug API error
                setError('Failed to load restaurant profile');
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchRestaurant();

        // Set an interval to refresh the restaurant's status every minute (60,000 ms)
        const intervalId = setInterval(fetchRestaurant, 60000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);

    }, [id]);

    if (loading) return <div className="p-8 text-lg">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'menu':
                return <MenuItemList restaurantId={id} />;
            case 'categories':
                return <MenuItemCategory restaurantId={id} />;
            case 'photos':
                return <div>Photos content goes here</div>;
            case 'updates':
                return <div>Updates content goes here</div>;
            case 'about':
                return <div>About content goes here</div>;
            default:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold">Overview</h2>
                        <p>{restaurant.description}</p> {/* Assuming `description` exists */}
                    </div>
                );
        }
    };

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: 'white',
    };

    return (
        <div style={backgroundStyle} className="flex">
            {/* Left Sidebar */}
            <div className="w-64 p-4 bg-gray-800 text-white">
                <h1 className="text-3xl font-bold mb-4 mt-4 ml-2">{restaurant.name}</h1>
                <p className={`mb-4 p-2 text-white text-center text-sm text-gray-600 ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'} bg-opacity-40 rounded-lg`}>
                    {restaurant.isOpen ? 'Open now' : 'Closed'} — {restaurant.openTime} to {restaurant.closeTime}
                </p>

                {restaurant.imageUrls?.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`Restaurant ${index}`}
                        className="w-full max-w-md mb-4 rounded-lg shadow mx-auto"
                    />
                ))}
                <ul>
                    <li
                        onClick={() => setActiveSection('menu')}
                        className={`cursor-pointer p-4 rounded mb-2 ${activeSection === 'menu' ? 'bg-gray-600' : ''}`}
                    >
                        Menu
                    </li>
                    <li
                        onClick={() => setActiveSection('categories')}
                        className={`cursor-pointer p-4 rounded mb-2 ${activeSection === 'categories' ? 'bg-gray-600' : ''}`}
                    >
                        Category
                    </li>                    
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                {renderSectionContent()}

            </div>
        </div>
    );
};

export default RestaurantProfile;
