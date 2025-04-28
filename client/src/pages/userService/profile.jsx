import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Save, MapPin, Phone, Mail, Shield, X, Camera, Clock, FileText, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/fetchapi';
import { createClient } from '@supabase/supabase-js';

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

    const navigate = useNavigate();

    useEffect(() => {
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
                    profile_image: currentUser.profileImage || '',
                    member_since: 'January 2023',
                    recent_orders: []
                });
                getOrders();
                setLoading(false);
            } else {
                console.log("No user found, redirecting to login");
                navigate('/login');
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [currentUser, navigate]);

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

            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, profile_image: reader.result });
            };
            reader.readAsDataURL(file);

            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.user_id}-${Date.now()}.${fileExt}`;
            const filePath = `profile-images/${fileName}`;

            const { data, error } = await supabase.storage
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

    const viewOrderDetails = (order) => {
        console.log(order)
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-700 to-primary-500 dark:from-slate-900 dark:to-green-900 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="h-10 w-64 bg-white bg-opacity-20 rounded mx-auto animate-pulse"></div>
                        <div className="h-6 w-96 bg-white bg-opacity-10 rounded mx-auto mt-2 animate-pulse"></div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
                        <div className="relative bg-gradient-to-r from-green-500 to-green-700 h-48 animate-pulse">
                            <div className="absolute -bottom-16 left-8">
                                <div className="w-32 h-32 rounded-full bg-white bg-opacity-30 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="mt-20 px-8 pb-8">
                            <div className="border-b border-gray-200 dark:border-slate-700">
                                <div className="flex space-x-8 py-4">
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                </div>

                                <div className="space-y-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i}>
                                            <div className="h-6 w-40 bg-gray-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="h-16 bg-gray-100 dark:bg-slate-700 rounded animate-pulse"></div>
                                                <div className="h-16 bg-gray-100 dark:bg-slate-700 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-700 to-primary-500 dark:from-slate-900 dark:to-green-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">My Profile</h1>
                    <p className="text-green-100 mt-2">Manage your account details and preferences</p>
                </div>

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md">
                        <div className="flex">
                            <div className="py-1">
                                <svg className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold">Success!</p>
                                <p className="text-sm">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

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
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                        ? 'border-green-500 text-green-600 dark:text-green-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                >
                                    Personal Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders'
                                        ? 'border-green-500 text-green-600 dark:text-green-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                >
                                    Order History
                                </button>
                            </nav>
                        </div>

                        <div className="pt-6">
                            {activeTab === 'profile' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{formData.name}</h2>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`flex items-center px-4 py-2 rounded-lg ${isEditing
                                                ? 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-white'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                        >
                                            {isEditing ? (
                                                <>
                                                    <X size={18} className="mr-2" /> Cancel
                                                </>
                                            ) : (
                                                <>
                                                    <Edit size={18} className="mr-2" /> Edit Profile
                                                </>
                                            )}
                                        </button>

                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone_number"
                                                        value={formData.phone_number}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User ID</label>
                                                    <input
                                                        type="text"
                                                        value={formData.user_id}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-600 cursor-not-allowed dark:text-gray-300"
                                                        disabled
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                                    <textarea
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        rows="3"
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-8 flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                                >
                                                    <Save size={18} className="mr-2" /> Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Contact Information</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="flex items-start">
                                                        <Mail className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                            <p className="text-gray-800 dark:text-white">{formData.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <Phone className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                            <p className="text-gray-800 dark:text-white">{formData.phone_number}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <MapPin className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                            <p className="text-gray-800 dark:text-white">{formData.address}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <Shield className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                                                            <p className="text-gray-800 dark:text-white">{formData.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Account Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="flex items-start">
                                                        <FileText className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                                                            <p className="text-gray-800 dark:text-white">{formData.user_id}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <Clock className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                                            <p className="text-gray-800 dark:text-white">{formData.member_since || 'January 2023'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order History</h2>
                                    </div>

                                    <div className="overflow-hidden shadow rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                            <thead className="bg-gray-50 dark:bg-slate-700">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                        Order ID
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                        Restaurant
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                        Total
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-800 dark:divide-slate-700">
                                                {formData.recent_orders && formData.recent_orders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                            {order.id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            {order.restaurant}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            {order.date}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            ${order.total.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" onClick={() => viewOrderDetails(order)}>
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {selectedOrder && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Details</h2>
                                                <button
                                                    onClick={closeOrderDetails}
                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between border-b pb-2 dark:border-slate-700">
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Order ID:</span>
                                                    <span className="text-gray-800 dark:text-white">{selectedOrder.id}</span>
                                                </div>

                                                <div className="flex justify-between border-b pb-2 dark:border-slate-700">
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Restaurant:</span>
                                                    <span className="text-gray-800 dark:text-white">{selectedOrder.restaurant}</span>
                                                </div>

                                                <div className="flex justify-between border-b pb-2 dark:border-slate-700">
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Date:</span>
                                                    <span className="text-gray-800 dark:text-white">{selectedOrder.date}</span>
                                                </div>

                                                <div className="flex justify-between border-b pb-2 dark:border-slate-700">
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Status:</span>
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        {selectedOrder.status}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between border-b pb-2 dark:border-slate-700">
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Payment Method:</span>
                                                    <span className="text-gray-800 dark:text-white">{selectedOrder.paymentMethod}</span>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium text-gray-600 dark:text-gray-300 mb-2">Order Items:</h3>
                                                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                                                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                                            <div key={index} className="flex justify-between py-2 border-b last:border-0 dark:border-slate-600">
                                                                <div>
                                                                    <span className="text-gray-800 dark:text-white">{item.menuItemName}</span>
                                                                    <span className="text-gray-500 dark:text-gray-400 ml-2">x{item.qty}</span>
                                                                </div>
                                                                <span className="text-gray-800 dark:text-white">${(item.menuItemPrice * item.qty).toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-4 space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                                                        <span className="text-gray-800 dark:text-white">${selectedOrder.orderAmount.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-300">Delivery Fee:</span>
                                                        <span className="text-gray-800 dark:text-white">${selectedOrder.deliveryFee.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold pt-2 border-t dark:border-slate-700">
                                                        <span className="text-gray-800 dark:text-white">Total:</span>
                                                        <span className="text-gray-800 dark:text-white">${selectedOrder.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;