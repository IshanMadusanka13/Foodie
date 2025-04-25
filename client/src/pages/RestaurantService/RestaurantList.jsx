import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/fetchapi';
import backgroundImage from '../../assets/hero.jpg';
import { Trash2 } from 'lucide-react';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await api.getAllRestaurants();
                setRestaurants(response?.data?.restaurants || []);
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Failed to fetch restaurants.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const handleDeleteRestaurant = async (restaurantId) => {
        if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

        try {
            await api.deleteRestaurant(restaurantId);
            setRestaurants((prev) => prev.filter((r) => r._id !== restaurantId));
        } catch (err) {
            console.error('Error deleting restaurant:', err);
            setError('Failed to delete restaurant.');
        }
    };

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '40px',
        color: 'white',
    };

    return (
        <div style={backgroundStyle}>
            <h1 className="text-3xl font-bold mb-4 text-center">Restaurants</h1>

            {error && <div className="text-red-500">{error}</div>}

            {loading ? (
                <div className="text-xl animate-pulse">Loading restaurants...</div>
            ) : (
                <ul className="space-y-4">
                    {restaurants.map((restaurant) => (
                        <li
                            key={restaurant._id}
                            className={`flex justify-between items-center p-4 rounded-lg shadow ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'
                                } bg-opacity-40 border border-black`} 
                        >
                            <Link
                                to={`/restaurant/${restaurant._id}`}
                                className="flex items-center space-x-4"
                            >
                                {restaurant.imageUrls?.length > 0 && (
                                    <img
                                        src={restaurant.imageUrls[0]}
                                        alt={restaurant.name}
                                        className="w-20 h-20 object-cover rounded-lg border border-white"
                                    />
                                )}
                                <span className="text-xl font-semibold text-white">{restaurant.name}</span>
                            </Link>

                            {/* Delete button */}
                            <button
                                onClick={() => handleDeleteRestaurant(restaurant._id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete restaurant"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RestaurantList;
