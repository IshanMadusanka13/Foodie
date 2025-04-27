import { useState } from 'react';
import { api } from '../../utils/fetchapi';

const AddMenuItem = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', price: '', description: '', isAvailable: true, image: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('isAvailable', formData.isAvailable);
            if (formData.image) data.append('image', formData.image);

            const response = await api.createMenuItem(data); // Assuming you have createMenuItem API
            if (response?.data?.item) {
                onSave(response.data.item); // Pass newly created item back to parent
            }
        } catch (err) {
            console.error('Failed to create menu item', err);
            alert('Creation failed!');
        }
    };

    return (
        <div className="text-black fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input fields */}
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="border p-2 w-full" />
                    <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" className="border p-2 w-full" />
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" className="border p-2 w-full" />
                    <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} className="border p-2 w-full" />
                    {/* Submit and Cancel buttons */}
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
