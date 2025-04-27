import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/fetchapi';
import backgroundImage from '../../assets/hero.jpg';
import { Trash2, Pencil } from 'lucide-react';
import EditRestaurant from './EditRestaurant';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingRestaurant, setEditingRestaurant] = useState(null);
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

    return (
        <div>
            <EditRestaurant 
                restaurant={editingRestaurant}
                onChange={setEditingRestaurant}
                onCancel={() => setEditingRestaurant(null)}
                onSave={async () => {
                    try {
                        const formData = new FormData();
                        formData.append("name", editingRestaurant.name);
                        formData.append("email", editingRestaurant.email);
                        formData.append("address", editingRestaurant.address);
                        formData.append("latitude", parseFloat(editingRestaurant.latitude) || 0);
                        formData.append("longitude", parseFloat(editingRestaurant.longitude) || 0);
                        formData.append("openTime", editingRestaurant.openTime);
                        formData.append("closeTime", editingRestaurant.closeTime);
                        formData.append("ownerId", editingRestaurant.ownerId);

                        if (editingRestaurant.newImage) {
                            formData.append("image", editingRestaurant.newImage);
                        } else if (editingRestaurant.imageUrls?.length > 0) {
                            // Send existing image URLs if no new image is selected
                            formData.append("imageUrls", JSON.stringify(editingRestaurant.imageUrls));
                        }

                        const updated = await api.updateRestaurant(editingRestaurant._id, formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });

                        if (updated?.data?.restaurant) {
                            setRestaurants((prev) =>
                                prev.map((restaurant) =>
                                    restaurant._id === editingRestaurant._id ? updated.data.restaurant : restaurant
                                )
                            );
                            setFilteredRestaurants((prev) =>
                                prev.map((restaurant) =>
                                    restaurant._id === editingRestaurant._id ? updated.data.restaurant : restaurant
                                )
                            );
                            setEditingRestaurant(null); // Close the edit form
                        } else {
                            throw new Error("Update failed: No restaurant returned");
                        }
                    } catch (err) {
                        console.error("Update failed:", err);
                        alert("Failed to update item");
                    }
                }}
            />

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

                            <div className="flex items-center space-x-3">
                                {/* Edit button */}
                                <button
                                    onClick={() => setEditingRestaurant(restaurant)}
                                    className="text-blue-400 hover:text-blue-600"
                                    title="Edit restaurant"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>

                                {/* Delete button */}
                                <button
                                    onClick={() => handleDeleteRestaurant(restaurant._id)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete restaurant"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RestaurantList;


