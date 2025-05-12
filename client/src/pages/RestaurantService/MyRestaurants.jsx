import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/fetchapi';

const MyRestaurants = () => {
    const { currentUser } = useAuth();
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-primary-700 text-2xl font-bold mb-4">My Restaurants</h2>
            {restaurants.length === 0 ? (
                <p>You do not have any restaurants yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant._id} className="border rounded-lg p-4 shadow">
                            <h3 className="text-black text-xl font-semibold">{restaurant.name}</h3>
                            <p className="text-gray-600">{restaurant.address}</p>
                            <p className={`mt-2 ${restaurant.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                {restaurant.isOpen ? 'Open' : 'Closed'}
                            </p>
                            <p className='text-black'>Hours: {restaurant.openTime} - {restaurant.closeTime}</p>
                            <div className="mt-2">
                                {restaurant.imageUrls?.length > 0 && (
                                    <img
                                        src={restaurant.imageUrls[0]}
                                        alt={restaurant.name}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRestaurants;