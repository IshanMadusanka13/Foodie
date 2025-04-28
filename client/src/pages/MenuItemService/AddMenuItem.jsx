import { useState } from 'react';
import { api } from '../../utils/fetchapi';

const CATEGORIES = [
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

const AddMenuItem = ({ onClose, onSave, restaurantId }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        isAvailable: true,
        category: CATEGORIES[0], // Default to first category
        image: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('restaurantId', restaurantId);
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('isAvailable', formData.isAvailable.toString());
            data.append('category', formData.category);
            if (formData.image) data.append('image', formData.image);

            const response = await api.createMenuItem(data);
            if (response?.data?.menuItem) {
                onSave(response.data.menuItem);
            }
        } catch (err) {
            console.error('Failed to create menu item', err);
            alert('Creation failed! ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="text-black fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Name"
                        className="border p-2 w-full"
                        required
                    />
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Price"
                        className="border p-2 w-full"
                        min="0"
                        step="0.01"
                        required
                    />
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description"
                        className="border p-2 w-full"
                    />
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="border p-2 w-full"
                        required
                    >
                        {CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            className="h-4 w-4"
                        />
                        <label htmlFor="isAvailable">Available</label>
                    </div>
                    <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        className="border p-2 w-full"
                        accept="image/*"
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMenuItem;