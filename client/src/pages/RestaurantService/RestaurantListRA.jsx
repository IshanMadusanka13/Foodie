import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/fetchapi';

const RestaurantListRA = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await api.getAllRestaurants();
                const data = response?.data?.restaurants || [];
                setRestaurants(data);
                setFilteredRestaurants(data);            
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError('Failed to fetch restaurants.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = restaurants.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    };

    return (
        <div>
        
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-primary-600 text-3xl font-bold mb-4 md:mb-0 text-center md:text-left">Restaurants</h1>
                <div className="w-full md:max-w-md">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search restaurants..."
                        className="w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                </div>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            {loading ? (
                <div className="text-xl animate-pulse">Loading restaurants...</div>
            ) : (
                <ul className="space-y-4">
                    {filteredRestaurants.map((restaurant) => (
                        <li
                            key={restaurant._id}
                            className={`flex justify-between items-center p-4 rounded-lg shadow ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'
                                } bg-opacity-40 border border-black`}
                        >
                            <Link
                                to={`/restaurantRA/${restaurant._id}`}
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RestaurantListRA;


