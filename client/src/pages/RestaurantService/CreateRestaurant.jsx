// External Libraries
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { v4 as uuidv4 } from 'uuid';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../hooks/useAuth';

// Assets
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Styles
import './CreateRestaurant.css';

// Utils
import { api } from '../../utils/fetchapi';
import { supabase } from '../../utils/supabaseClient';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Component: LocationPicker
const LocationPicker = ({ setLatLng }) => {
    useMapEvents({
        click(e) {
            setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return null;
};

LocationPicker.propTypes = {
    setLatLng: PropTypes.func.isRequired,
};

// Main Component
const CreateRestaurant = ({ setActiveView }) => {
    const { currentUser } = useAuth();
    const [form, setForm] = useState({
        name: '',
        address: '',
        email: '',
        openTime: '',
        closeTime: '',
        latitude: 6.9271,
        longitude: 79.8612,
        imageUrls: [],
        pin: '',
        ownerId: '',
        ownerName: '',
    });

    // Set ownerId when component mounts
    useEffect(() => {
        if (currentUser?._id) {
            setForm(prev => ({
                ...prev,
                ownerId: currentUser._id,
                ownerName: currentUser.name || ''
            }));
        }
    }, [currentUser]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Effect: Clear success after timeout
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Handlers
    const setLatLng = ({ lat, lng }) => {
        setForm(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: ['latitude', 'longitude'].includes(name)
                ? value === '' ? '' : Number(value)
                : value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) throw new Error('File too large (max 5MB)');

            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) throw new Error('Invalid file type');

            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `restaurants/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('foodie')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('foodie')
                .getPublicUrl(filePath);

            setForm(prev => ({ ...prev, imageUrls: [publicUrl] }));
        } catch (err) {
            console.error('Upload error:', err);
            setError(`Upload failed: ${err.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const { ownerId, name, address, email, latitude, longitude, openTime, closeTime, imageUrls } = form;

            if (!ownerId, !name || !address || !email || isNaN(latitude) || isNaN(longitude)) {
                throw new Error('Please fill all required fields');
            }

            const restaurantData = {
                ownerId,
                name,
                address,
                email,
                latitude, 
                longitude,
                openTime,
                closeTime,
                imageUrls,
            };

            const token = localStorage.getItem('token');
            const response = await api.createRestaurant(restaurantData, token);

            if (response?.status === 'Success') {
                setSuccess(true);
                setForm({
                    ownerId: '',
                    name: '',
                    address: '',
                    email: '',
                    openTime: '',
                    closeTime: '',
                    latitude: '',
                    longitude: '',
                    imageUrls: [],
                    pin: '',
                });
            } else {
                console.error('Error creating restaurant:', response?.message);
                throw new Error(response?.message || 'Failed to create restaurant');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while creating the restaurant');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-black bg-white p-6 rounded-lg shadow-md" >
            <button
                onClick={() => setActiveView('join_Us')}
                className="mb-4 text-primary-600 hover:text-primary-800"
            >
                ← Back 
            </button>
            <h2 className="text-black text-3xl mb-8 font-semibold text-center">Create Your Restaurant</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Owner ID */}
                    <div>
                    <label className="block mb-1 font-medium">Owner</label>
                    <input
                        type="text"
                        name="ownerName"
                        className="text-black w-full border px-4 py-2 rounded bg-gray-100 cursor-not-allowed"
                        value={form.ownerName}
                        readOnly
                    />
                    {/* Hidden input to still send the ownerId */}
                    <input type="hidden" name="ownerId" value={form.ownerId} />
                    </div>
                    {/* Name */}
                    <div>
                        <label className="block mb-1 font-medium">Restaurant Name*</label>
                        <input
                            type="text"
                            name="name"
                            className="text-black w-full border px-4 py-2 rounded"
                            placeholder="Enter restaurant name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium">Email*</label>
                        <input
                            type="email"
                            name="email"
                            className="text-black w-full border px-4 py-2 rounded"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block mb-1 font-medium">Address*</label>
                        <input
                            type="text"
                            name="address"
                            className="text-black w-full border px-4 py-2 rounded"
                            placeholder="Enter address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Latitude */}
                    <div>
                        <label className="block mb-1 font-medium">Latitude*</label>
                        <input
                            type="number"
                            step="any"
                            name="latitude"
                            className="text-black w-full border px-4 py-2 rounded"
                            placeholder="e.g., 6.9271"
                            value={form.latitude}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Longitude */}
                    <div>
                        <label className="block mb-1 font-medium">Longitude*</label>
                        <input
                            type="number"
                            step="any"
                            name="longitude"
                            className="text-black w-full border px-4 py-2 rounded"
                            placeholder="e.g., 79.8612"
                            value={form.longitude}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Google Map Pin */}
                    <div className="col-span-full">
                        <label className="block mb-1 font-medium">Pick a location*</label>
                        <div className="h-64 w-full mb-4 rounded overflow-hidden" >
                            <MapContainer
                                center={[
                                    parseFloat(form.latitude || '6.9271'),
                                    parseFloat(form.longitude || '79.8612'),
                                ]}
                                zoom={16}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                <LocationPicker setLatLng={setLatLng} />
                                {form.latitude && form.longitude && (
                                    <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]} />
                                )}
                            </MapContainer>
                        </div>
                    </div>
                

                    {/* Open Time */}
                    <div>
                    <label className="block font-medium">Open Time*</label>                        
                    <input
                        type="time"
                        name="openTime"
                        className="text-black w-full border px-4 py-2 rounded"
                        value={form.openTime}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    {/* Close Time */}
                    <div>
                        <label className="block mb-1 font-medium">Close Time*</label>
                        <input
                            type="time"
                            name="closeTime"
                            className="text-black w-full border px-4 py-2 rounded"
                            value={form.closeTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="col-span-full">
                        <label className="block font-medium">Restaurant Image*</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="text-black w-full border px-4 py-2 rounded"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {/* Error-Success messages */}
                    {error && (
                        <div className="col-span-full p-4 mb-4 text-red-700 bg-red-100 rounded">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="col-span-full p-4 mb-4 text-green-700 bg-green-100 rounded">
                            Restaurant created successfully!
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="col-span-full text-center mt-2">
                        <button
                            type="submit"
                            className="bg-primary-800 text-white px-6 py-2 rounded hover:bg-primary-600 transition duration-200 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'SignUp and Continue'}
                        </button>
                    </div>
                </form>            
        </div>
    );
};

CreateRestaurant.propTypes = {
    setActiveView: PropTypes.func.isRequired,  
};

export default CreateRestaurant;

