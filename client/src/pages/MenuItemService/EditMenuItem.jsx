// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import { api } from '../../utils/fetchapi';

// const EditMenuItem = ({ item, onCancel, onSave }) => {
//     const [updatedItem, setUpdatedItem] = useState(item);
//     const [selectedImages, setSelectedImages] = useState([]);

//     // Handle changes in input fields
//     const handleInputChange = (e) => {
//         setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value });
//     };

//     // Handle image selection
//     const handleImageChange = (e) => {
//         setSelectedImages(e.target.files);
//     };

//     const handleSave = () => {
//         // Call the updateMenuItem function when the user clicks save
//         api.updateMenuItem(updatedItem._id, updatedItem, selectedImages)
//             .then(response => {
//                 console.log('Update successful:', response);
//                 onSave(); // This will trigger closing the modal or UI update
//             })
//             .catch(error => {
//                 console.error('Update failed:', error);
//                 // Optionally show error message to the user
//             });
//     };

//     return (
//         <div className="text-black fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//                 <h2 className="text-2xl font-semibold mb-4">Update Menu Item</h2>

//                 <div className="mb-3">
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                         Name
//                     </label>
//                     <input
//                         id="name"
//                         name="name"
//                         type="text"
//                         value={updatedItem.name}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded"
//                         placeholder="Name"
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                         Description
//                     </label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         value={updatedItem.description}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded"
//                         placeholder="Description"
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//                         Price
//                     </label>
//                     <input
//                         id="price"
//                         name="price"
//                         type="number"
//                         value={updatedItem.price}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border rounded"
//                         placeholder="Price"
//                     />
//                 </div>

//                 <div className="mb-3">
//                     <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
//                         Select Images
//                     </label>
//                     <input
//                         type="file"
//                         id="images"
//                         name="images"
//                         multiple
//                         onChange={handleImageChange}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>

//                 <div className="flex items-center mb-4">
//                     <input
//                         id="availability"
//                         name="isAvailable"
//                         type="checkbox"
//                         checked={updatedItem.isAvailable}
//                         onChange={(e) =>
//                             setUpdatedItem({ ...updatedItem, isAvailable: e.target.checked })
//                         }
//                         className="mr-2"
//                     />
//                     <label htmlFor="availability" className="text-gray-700">Available</label>
//                 </div>

//                 <div className="flex justify-end space-x-2">
//                     <button onClick={onCancel} className="px-4 py-2 rounded border hover:bg-gray-100">Cancel</button>
//                     <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// EditMenuItem.propTypes = {
//     item: PropTypes.object.isRequired,
//     onChange: PropTypes.func.isRequired,
//     onCancel: PropTypes.func.isRequired,
//     onSave: PropTypes.func.isRequired,
// };

// export default EditMenuItem;

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

