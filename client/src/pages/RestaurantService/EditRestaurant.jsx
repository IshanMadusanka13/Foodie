import PropTypes from 'prop-types';

const EditRestaurant = ({ restaurant, onChange, onCancel, onSave }) => {
    if (!restaurant) return null;

    return (
        <div className="text-black fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Edit Restaurant</h2>

                {/* Name input with label */}
                <div className="mb-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={restaurant.name}
                        onChange={(e) => onChange({ ...restaurant, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Name"
                    />
                </div>

                {/* Email input with label */}
                <div className="mb-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={restaurant.email}
                        onChange={(e) => onChange({ ...restaurant, email: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Email"
                    />
                </div>

                {/* Address input with label */}
                <div className="mb-3">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        id="address"
                        type="text"
                        value={restaurant.address}
                        onChange={(e) => onChange({ ...restaurant, address: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Address"
                    />
                </div>

                {/* Latitude input with label */}
                <div className="mb-3">
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                    </label>
                    <input
                        id="latitude"
                        type="number"
                        value={restaurant.latitude || ''}
                        onChange={(e) => onChange({ ...restaurant, latitude: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Latitude"
                    />
                </div>

                {/* Longitude input with label */}
                <div className="mb-3">
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                    </label>
                    <input
                        id="longitude"
                        type="number"
                        value={restaurant.longitude || ''}
                        onChange={(e) => onChange({ ...restaurant, longitude: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Longitude"
                    />
                </div>

                {/* Open time input with label */}
                <div className="mb-3">
                    <label htmlFor="openTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Open Time
                    </label>
                    <input
                        id="openTime"
                        type="time"
                        value={restaurant.openTime}
                        onChange={(e) => onChange({ ...restaurant, openTime: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Close time input with label */}
                <div className="mb-3">
                    <label htmlFor="closeTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Close Time
                    </label>
                    <input
                        id="closeTime"
                        type="time"
                        value={restaurant.closeTime}
                        onChange={(e) => onChange({ ...restaurant, closeTime: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* OwnerId input with label */}
                <div className="mb-3">
                    <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">
                        Owner ID
                    </label>
                    <input
                        id="ownerId"
                        type="text"
                        value={restaurant.ownerId || ''}
                        onChange={(e) => onChange({ ...restaurant, ownerId: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Owner ID"
                    />
                </div>

                {/* Image input with label */}
                <div className="mb-3">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange({ ...restaurant, newImage: e.target.files?.[0] })}
                        className="w-full p-2 border rounded"
                    />
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

EditRestaurant.propTypes = {
    restaurant: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditRestaurant;
