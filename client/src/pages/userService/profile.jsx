import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/fetchapi';
import { createClient } from '@supabase/supabase-js';
import PersonalInformation from '../../components/profileComponents/PersonalInformation';
import EditProfileForm from '../../components/profileComponents/EditProfileForm';
import OrderHistory from '../../components/profileComponents/OrderHistory';
import DeliveryHistory from '../../components/profileComponents/DeliveryHistory';
import OrderDetails from '../../components/profileComponents/OrderDetails';
import DeliveryDetails from '../../components/profileComponents/DeliveryDetails';
import LoadingProfile from '../../components/profileComponents/LoadingProfile';
import SuccessMessage from '../../components/profileComponents/SuccessMessage';
import { Camera, Shield } from 'lucide-react';

const supabaseUrl = 'https://nelqemsnxiomtaosceui.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbHFlbXNueGlvbXRhb3NjZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NTA1OTEsImV4cCI6MjA2MTQyNjU5MX0.blyjPV4hGnAQpaCyWJD1LAljPt5SWa8o4SxvWEAGAUU';
const supabase = createClient(supabaseUrl, supabaseKey);

const Profile = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return;

        setLoading(true);
        const timer = setTimeout(() => {
            if (currentUser) {
                setFormData({
                    user_id: currentUser.user_id || '',
                    name: currentUser.name || '',
                    email: currentUser.email || '',
                    phone_number: currentUser.phone_number || '',
                    address: currentUser.address || '',
                    role: currentUser.role || '',
                    profile_image: currentUser.profile_image || '',
                    member_since: 'April 2025',
                    recent_orders: []
                });

                if (currentUser.role === 'customer') {
                    getOrders();
                } else if (currentUser.role === 'rider') {
                    getDeliveries();
                }

                setLoading(false);
            } else {
                console.log("No user found, redirecting to login");
                navigate('/login');
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [currentUser, navigate, authLoading]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const getOrders = async () => {
        try {
            const response = await api.getOrderByUser(currentUser.user_id);
            const transformedOrders = response.map(order => ({
                id: order.order_id,
                restaurant: order.restaurant,
                date: new Date(order.placedAt).toISOString().split('T')[0],
                status: order.status,
                total: order.total,
                items: order.items,
                orderAmount: order.orderAmount,
                deliveryFee: order.deliveryFee,
                paymentMethod: order.paymentMethod
            }));

            setFormData(prev => ({
                ...prev,
                recent_orders: transformedOrders
            }));
        } catch (error) {
            console.error('Error getting orders:', error);
            setSuccessMessage('Failed to get orders. Please try again.');
        }
    };

    const getDeliveries = async () => {
        try {
            const response = await api.getDeliveriesByRider(currentUser.user_id);
            const transformedDeliveries = await Promise.all(response.map(async delivery => {
                const restaurantAddress = await getAddressFromCoordinates(
                    delivery.restaurant_location.latitude,
                    delivery.restaurant_location.longitude
                );
                const customerAddress = await getAddressFromCoordinates(
                    delivery.customer_location.latitude,
                    delivery.customer_location.longitude
                );

                return {
                    id: delivery.delivery_id,
                    order_id: delivery.order_id,
                    status: delivery.status,
                    restaurantAddress,
                    customerAddress,
                    date: new Date(delivery.created_at).toISOString().split('T')[0],
                    acceptedAt: delivery.accepted_at ? new Date(delivery.accepted_at).toLocaleString() : '-',
                    collectedAt: delivery.collected_at ? new Date(delivery.collected_at).toLocaleString() : '-',
                    deliveredAt: delivery.delivered_at ? new Date(delivery.delivered_at).toLocaleString() : '-'
                };
            }));

            setDeliveries(transformedDeliveries);
        } catch (error) {
            console.error('Error getting deliveries:', error);
            setSuccessMessage('Failed to get delivery history. Please try again.');
        }
    };

    const getAddressFromCoordinates = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            return data?.display_name || "Address not found";
        } catch (error) {
            console.error("Error fetching address", error);
            return "Error fetching address";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: formData.address
            };

            const response = await api.editProfile(updateData, currentUser.user_id);
            if (response.status === 200) {
                setIsEditing(false);
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setSuccessMessage('Failed to update profile. Please try again.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            // Preview image
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, profile_image: reader.result });
            };
            reader.readAsDataURL(file);

            // Upload to Supabase
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.user_id}-${Date.now()}.${fileExt}`;
            const filePath = `profile-images/${fileName}`;

            const { error } = await supabase.storage
                .from('foodie')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('foodie')
                .getPublicUrl(filePath);

            const imageUrl = urlData.publicUrl;
            await api.updateProfileImage({ profileImage: imageUrl }, currentUser.user_id);

            setSuccessMessage('Profile image updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error uploading image:', error);
            setSuccessMessage('Failed to update profile image. Please try again.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return <LoadingProfile />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-700 to-primary-500 dark:from-slate-900 dark:to-green-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">My Profile</h1>
                    <p className="text-green-100 mt-2">Manage your account details and preferences</p>
                </div>

                {successMessage && <SuccessMessage message={successMessage} />}

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="relative bg-gradient-to-r from-green-500 to-green-700 h-48">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                {formData.profile_image ? (
                                    <img
                                        src={formData.profile_image}
                                        alt={formData.name}
                                        className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white">
                                        <span className="text-5xl font-bold text-green-500">
                                            {formData.name ? formData.name.charAt(0) : ''}
                                        </span>
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full text-white cursor-pointer shadow-lg hover:bg-green-700 transition">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-6">
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-1 text-white flex items-center">
                                <Shield size={16} className="mr-2" />
                                <span>{formData.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 px-8 pb-8">
                        <div className="border-b border-gray-200 dark:border-slate-700">
                            <nav className="flex space-x-8">
                                {[
                                    { id: 'profile', label: 'Personal Information', visible: true },
                                    { id: 'orders', label: 'Order History', visible: formData.role === 'customer' },
                                    { id: 'riding', label: 'Riding History', visible: formData.role === 'rider' }
                                ].filter(tab => tab.visible).map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                                ? 'border-green-500 text-green-600 dark:text-green-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="pt-6">
                            {activeTab === 'profile' && (
                                isEditing ? (
                                    <EditProfileForm
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleSubmit={handleSubmit}
                                        setIsEditing={setIsEditing}
                                    />
                                ) : (
                                    <PersonalInformation
                                        formData={formData}
                                        setIsEditing={setIsEditing}
                                    />
                                )
                            )}

                            {activeTab === 'orders' && formData.role === 'customer' && (
                                <OrderHistory
                                    orders={formData.recent_orders}
                                    viewOrderDetails={(order) => setSelectedOrder(order)}
                                />
                            )}

                            {activeTab === 'riding' && formData.role === 'rider' && (
                                <DeliveryHistory
                                    deliveries={deliveries}
                                    viewDeliveryDetails={(delivery) => setSelectedDelivery(delivery)}
                                />
                            )}

                            {selectedOrder && (
                                <OrderDetails
                                    order={selectedOrder}
                                    closeOrderDetails={() => setSelectedOrder(null)}
                                />
                            )}

                            {selectedDelivery && (
                                <DeliveryDetails
                                    delivery={selectedDelivery}
                                    closeDeliveryDetails={() => setSelectedDelivery(null)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
