import { useEffect, useState, useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/fetchapi';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';

const MyRestaurants = ({setActiveView}) => {
    const { currentUser } = useAuth();
    const { darkMode } = useContext(ThemeContext);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                if (currentUser?._id) {
                    const data = await api.getRestaurantsByOwner(currentUser._id);
                    setRestaurants(data.data.restaurants || []);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch restaurants');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [currentUser]);

    // Theme classes
    const containerClasses = `container mx-auto p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`;
    const titleClasses = `text-2xl font-bold mb-4 ${darkMode ? 'text-primary-400' : 'text-primary-700'}`;
    const cardClasses = `border rounded-lg p-4 shadow transition-shadow ${darkMode
            ? 'bg-gray-700 border-gray-600 hover:shadow-lg hover:shadow-gray-600'
            : 'bg-white border-gray-200 hover:shadow-lg'
        }`;
    const restaurantNameClasses = `text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`;
    const addressClasses = darkMode ? 'text-gray-300' : 'text-gray-600';
    const hoursClasses = darkMode ? 'text-gray-200' : 'text-black';

    if (loading) return (
        <div className={`flex justify-center items-center h-64 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    if (error) return (
        <div className={`p-4 ${darkMode ? 'bg-gray-800 text-red-400' : 'bg-white text-red-600'}`}>
            Error: {error}
        </div>
    );

    return (
        <div className={containerClasses}>
            <h2 className={titleClasses}>My Restaurants</h2>
            {restaurants.length === 0 ? (
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    You do not have any restaurants yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restaurants.map((restaurant) => (
                        <Link
                            to={`/restaurantRA/${restaurant._id}`}
                            key={restaurant._id}
                            className={cardClasses}
                        >
                            <h3 className={restaurantNameClasses}>{restaurant.name}</h3>
                            <p className={addressClasses}>{restaurant.address}</p>
                            <p className={`mt-2 ${restaurant.isOpen ? 'text-green-500' : 'text-red-500'}`}>
                                {restaurant.isOpen ? 'Open' : 'Closed'}
                            </p>
                            <p className={hoursClasses}>
                                Hours: {restaurant.openTime} - {restaurant.closeTime}
                            </p>
                            <div className="mt-2">
                                {restaurant.imageUrls?.length > 0 && (
                                    <img
                                        src={restaurant.imageUrls[0]}
                                        alt={restaurant.name}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

MyRestaurants.propTypes = {
    setActiveView: PropTypes.func.isRequired,
};

export default MyRestaurants;