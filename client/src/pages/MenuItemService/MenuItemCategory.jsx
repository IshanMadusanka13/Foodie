import { useState, useEffect } from 'react';
import { api } from '../../utils/fetchapi';

const MenuItemCategory = () => {
    const [category, setCategory] = useState('');
    const [menuItems, setMenuItems] = useState([]); // Initialized as an empty array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = [
        'Appetizers',
        'Salads',
        'Main Course',
        'Pizzas',
        'Burgers & Sandwiches',
        'Asian Specials',
        'Mexican',
        'Beverages',
        'Desserts',
    ];

    useEffect(() => {
        if (!category) return;

        const fetchMenuItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.getMenuItemsByCategory(category);
                // Ensure that response.items is always an array
                setMenuItems(response.items || []); // Default to empty array if undefined
            } catch (err) {
                console.error(err);
                setError('Error fetching menu items');
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, [category]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Menu Items by Category</h1>

            <div className="text-black mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {loading && <p>Loading menu items...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <div key={item._id} className="border p-4 rounded shadow-md">
                            <img
                                src={item.imageUrls?.[0]}
                                alt={item.name}
                                className="w-full h-40 object-cover mb-4 rounded"
                            />
                            <h2 className="text-xl font-semibold">{item.name}</h2>
                            <p className="text-gray-500">{item.description}</p>
                            <p className="text-lg font-bold text-green-600">${item.price}</p>
                            <p className="text-sm text-gray-600">Category: {item.category}</p>
                        </div>
                    ))
                ) : (
                    <p>No menu items found for this category.</p>
                )}
            </div>
        </div>
    );
};

export default MenuItemCategory;
