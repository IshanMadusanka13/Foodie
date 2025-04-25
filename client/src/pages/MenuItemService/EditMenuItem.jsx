import React from 'react';
import PropTypes from 'prop-types';

const EditMenuItem = ({ item, onChange, onCancel, onSave }) => {
    if (!item) return null;

    return (
        <div className="text-black fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Edit Menu Item</h2>

                {/* Name input with label */}
                <div className="mb-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={item.name}
                        onChange={(e) => onChange({ ...item, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Name"
                    />
                </div>

                {/* Description input with label */}
                <div className="mb-3">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={item.description}
                        onChange={(e) => onChange({ ...item, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Description"
                    />
                </div>

                {/* Price input with label */}
                <div className="mb-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                    </label>
                    <input
                        id="price"
                        type="number"
                        value={item.price}
                        onChange={(e) => onChange({ ...item, price: parseFloat(e.target.value) })}
                        className="w-full p-2 border rounded"
                        placeholder="Price"
                    />
                </div>

                {/* Image input with label */}
                <div className="mb-3">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange({ ...item, newImage: e.target.files?.[0] })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Availability checkbox with label */}
                <div className="flex items-center mb-4">
                    <input
                        id="availability"
                        type="checkbox"
                        checked={item.isAvailable}
                        onChange={(e) =>
                            onChange({ ...item, isAvailable: e.target.checked })
                        }
                        className="mr-2"
                    />
                    <label htmlFor="availability" className="text-gray-700">Available</label>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded border hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

EditMenuItem.propTypes = {
    item: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditMenuItem;

