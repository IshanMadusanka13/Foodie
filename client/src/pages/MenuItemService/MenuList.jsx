import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';  
import { api } from '../../utils/fetchapi';
import { SearchIcon } from '@heroicons/react/solid';  
import { Pencil, Trash2 } from 'lucide-react';
import EditMenuItem from './EditMenuItem'; 

const MenuItemList = ({ restaurantId }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [notFoundMessage, setNotFoundMessage] = useState('');
    const [editingItem, setEditingItem] = useState(null);  

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const res = await api.getMenuItemsByRestaurant(restaurantId);
                setMenuItems(res?.data?.items || []);
                setFilteredItems(res?.data?.items || []);  // Initialize filtered items
            } catch (err) {
                console.error(err);
                setError('Failed to load menu items');
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) fetchMenuItems();
    }, [restaurantId]);

    useEffect(() => {
        if (searchId) {
            // Real-time search: Filter items based on search input
            const filtered = menuItems.filter((item) =>
                item.name.toLowerCase().includes(searchId.toLowerCase())
            );
            setFilteredItems(filtered);

            // Show message if no results are found
            if (filtered.length === 0) {
                setNotFoundMessage('No matching menu items found!');
            } else {
                setNotFoundMessage('');
            }
        } else {
            setFilteredItems(menuItems); // Show all items if search is cleared
            setNotFoundMessage('');
        }
    }, [searchId, menuItems]);

    if (loading) return <div>Loading menu items...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!menuItems.length) return <div>No menu items available.</div>;

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;

        try {
            await api.deleteMenuItem(id);
            // Remove deleted item from state
            setMenuItems((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete menu item');
        }
    };

    return (
        <div>
            {/* Edit Menu Item Modal */}
            <EditMenuItem
                item={editingItem}
                onChange={setEditingItem}
                onCancel={() => setEditingItem(null)}
                onSave={async () => {
                    try {
                        const formData = new FormData();
                        formData.append("name", editingItem.name);
                        formData.append("description", editingItem.description);
                        formData.append("price", editingItem.price.toString());
                        formData.append("isAvailable", editingItem.isAvailable.toString());

                        if (editingItem.newImage) {
                            formData.append("image", editingItem.newImage);  
                        } else if (editingItem.imageUrls?.length > 0) {
                            // Send existing image URLs if no new image is selected
                            formData.append("imageUrls", JSON.stringify(editingItem.imageUrls));
                        }

                        const updated = await api.updateMenuItem(editingItem._id, formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });

                        if (updated?.data?.restaurant) {
                            setMenuItems((prev) =>
                                prev.map((item) => (
                                    item._id === editingItem._id ? updated.data.item : item)
                                )
                            );
                            setFilteredItems((prev) =>
                                prev.map((item) => (
                                    item._id === editingItem._id ? updated.data.item : item)
                                )
                            );
                            setEditingItem(null);
                        } else {
                            throw new Error("Update failed: No restaurant returned");
                        }
                    } catch (err) {
                        console.error("Update failed:", err);
                        alert("Failed to update item");
                    }
                }}
            />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Menu</h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Find Something delicious 🤤"
                        className="border border-gray-300 rounded p-2 text-gray-700 placeholder-gray-400 w-64"
                    />
                    <button
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
                    >
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Display not found message */}
            {notFoundMessage && <div className="text-red-500 mb-4">{notFoundMessage}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl text-black font-semibold">{item.name}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingItem(item)} // Open edit modal
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <Pencil className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="text-green-600 font-bold mt-2">${item.price.toFixed(2)}</p>
                        {item.imageUrls?.length > 0 && (
                            <img
                                src={item.imageUrls[0]}
                                alt={item.name}
                                className="mt-4 w-full h-48 object-cover rounded"
                            />
                        )}
                        <p className={`mt-2 text-sm ${item.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                            {item.isAvailable ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Prop validation for restaurantId
MenuItemList.propTypes = {
    restaurantId: PropTypes.string.isRequired,  
};

export default MenuItemList;
