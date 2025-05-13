import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../utils/fetchapi';
import { SearchIcon } from '@heroicons/react/solid';
import EditMenuItem from './EditMenuItem';
import AddMenuItem from './AddMenuItem';
import { Pencil, Trash2 } from 'lucide-react';
import { ThemeContext } from '../../contexts/ThemeContext';

const MenuItemList = ({ restaurantId }) => {
    const { darkMode } = useContext(ThemeContext);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [notFoundMessage, setNotFoundMessage] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const res = await api.getMenuItemsByRestaurant(restaurantId);
                setMenuItems(res?.data?.items || []);
                setFilteredItems(res?.data?.items || []);
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
            const filtered = menuItems.filter((item) =>
                item.name.toLowerCase().includes(searchId.toLowerCase())
            );
            setFilteredItems(filtered);
            setNotFoundMessage(filtered.length === 0 ? 'No matching menu items found!' : '');
        } else {
            setFilteredItems(menuItems);
            setNotFoundMessage('');
        }
    }, [searchId, menuItems]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;

        try {
            await api.deleteMenuItem(id);
            setMenuItems((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete menu item');
        }
    };

    if (loading) return (
        <div className={`flex justify-center items-center h-64 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    if (error) return (
        <div className={`p-4 ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
            {error}
        </div>
    );

    if (!menuItems.length) return (
        <div className={`p-4 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>
            No menu items available.
        </div>
    );

    // Theme classes
    const inputClasses = `border rounded p-2 placeholder-gray-400 w-64 ${darkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-700'
        }`;

    const cardClasses = `shadow-md rounded-lg p-4 border flex flex-col ${darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`;

    return (
        <div className={darkMode ? 'bg-gray-900' : 'bg-white'}>
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
                            formData.append("imageUrls", JSON.stringify(editingItem.imageUrls));
                        }

                        const updated = await api.updateMenuItem(editingItem._id, formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                        });

                        if (updated?.data?.item) {
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

            {/* Add Menu Item Modal */}
            {showAddModal && (
                <AddMenuItem
                    restaurantId={restaurantId}
                    onClose={() => setShowAddModal(false)}
                    onSave={(newItem) => {
                        setMenuItems(prev => [...prev, newItem]);
                        setFilteredItems(prev => [...prev, newItem]);
                        setShowAddModal(false);
                    }}
                />
            )}

            <div className="flex justify-between items-center mb-4 p-4">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                    Menu
                </h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Find Something delicious 🤤"
                        className={inputClasses}
                    />
                    <button
                        className={`p-2 rounded flex items-center ${darkMode
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                    >
                        <SearchIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`p-2 rounded ${darkMode
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                    >
                        Add Item
                    </button>
                </div>
            </div>

            {notFoundMessage && (
                <div className={`p-4 mb-4 ${darkMode ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
                    {notFoundMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {filteredItems.map((item) => (
                    <div key={item._id} className={cardClasses}>
                        <div className="flex justify-between items-start">
                            <h3 className={`mb-2 text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'
                                }`}>
                                {item.name}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingItem(item)}
                                    className={darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className={darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className={`font-bold mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                            ${item.price.toFixed(2)}
                        </p>
                        {item.imageUrls?.length > 0 && (
                            <img
                                src={item.imageUrls[0]}
                                alt={item.name}
                                className="mt-4 w-full h-48 object-cover rounded"
                            />
                        )}
                        <p className={`mt-2 text-sm ${item.isAvailable
                                ? (darkMode ? 'text-green-400' : 'text-green-500')
                                : (darkMode ? 'text-red-400' : 'text-red-500')
                            }`}>
                            {item.isAvailable ? 'Available' : 'Not Available'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

MenuItemList.propTypes = {
    restaurantId: PropTypes.string.isRequired,
};

export default MenuItemList;