import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Save, MapPin, Phone, Mail, Shield, X, Camera, PenSquare, Clock, FileText, ShoppingBag, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/fetchapi'

const Profile = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);

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
                    favorite_cuisines: ['Italian', 'Japanese', 'Mexican'],
                    payment_methods: [
                        { id: 1, type: 'Visa', last4: '4242', default: true },
                        { id: 2, type: 'Mastercard', last4: '5678', default: false }
                    ],
                    recent_orders: [
                        { id: 'ORD-95721', restaurant: 'Green Garden Bistro', date: '2025-04-18', status: 'Delivered', total: 34.99 },
                        { id: 'ORD-95532', restaurant: 'Spice Palace', date: '2025-04-10', status: 'Delivered', total: 52.25 },
                        { id: 'ORD-94998', restaurant: 'Fresh Bites', date: '2025-04-03', status: 'Delivered', total: 27.50 }
                    ]
                });
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


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData({ ...formData, profile_image: reader.result });
            };
            reader.readAsDataURL(file);
        }
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
                                <button
                                    onClick={() => setActiveTab('payment')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment'
                                        ? 'border-green-500 text-green-600 dark:text-green-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                >
                                    Payment Methods
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
                                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Preferences</h3>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Favorite Cuisines</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.favorite_cuisines && formData.favorite_cuisines.map((cuisine, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-200"
                                                            >
                                                                {cuisine}
                                                            </span>
                                                        ))}
                                                        <button className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full flex items-center dark:bg-slate-700 dark:text-gray-300">
                                                            <PenSquare size={14} className="mr-1" /> Edit
                                                        </button>
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
                                        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
                                            <ShoppingBag size={18} className="mr-2" /> View All Orders
                                        </button>
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
                                                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
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

                            {activeTab === 'payment' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payment Methods</h2>
                                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                                            <CreditCard size={18} className="mr-2" /> Add Payment Method
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.payment_methods && formData.payment_methods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`border rounded-lg p-4 flex justify-between items-center ${method.default
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                                                    : 'border-gray-200 dark:border-slate-700'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <div className="bg-white p-2 rounded-md shadow mr-4 dark:bg-slate-700">
                                                        {method.type === 'Visa' ? (
                                                            <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
                                                                <rect width="48" height="48" fill="white" />
                                                                <path d="M15 24L17 17H21L19 24H15Z" fill="#3C58BF" />
                                                                <path d="M15 24L18 17H21L19 24H15Z" fill="#293688" />
                                                                <path d="M33 17L30 24H26L29 17H33Z" fill="#3C58BF" />
                                                                <path d="M33 17L30 24H27L29 17H33Z" fill="#293688" />
                                                                <path d="M27 17L24 24H21L22 21L23 17H27Z" fill="#3C58BF" />
                                                                <path d="M27 17L24 24H21L22 21L23 17H27Z" fill="#293688" />
                                                                <path d="M18 29L16 31H27L28 29H18Z" fill="#FFBC00" />
                                                                <path d="M14.5 24H19L21 31H16.5L14.5 24Z" fill="#3C58BF" />
                                                                <path d="M14.5 24H19L21 31H16.5L14.5 24Z" fill="#293688" />
                                                                <path d="M22.5 24H28L26 31H20.5L22.5 24Z" fill="#3C58BF" />
                                                                <path d="M22.5 24H28L26 31H20.5L22.5 24Z" fill="#293688" />
                                                                <path d="M29.5 24H34L31.5 31H27L29.5 24Z" fill="#3C58BF" />
                                                                <path d="M29.5 24H34L31.5 31H27L29.5 24Z" fill="#293688" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none">
                                                                <rect width="48" height="48" fill="white" />
                                                                <path d="M16 19H32V29H16V19Z" fill="#16366F" />
                                                                <path d="M19.5 24C19.5 22.3431 20.8431 21 22.5 21C24.1569 21 25.5 22.3431 25.5 24C25.5 25.6569 24.1569 27 22.5 27C20.8431 27 19.5 25.6569 19.5 24Z" fill="#D9222A" />
                                                                <path d="M22.5 27C24.1569 27 25.5 25.6569 25.5 24C25.5 22.3431 24.1569 21 22.5 21" fill="#EE9F2D" />
                                                                <path d="M25.5 24C25.5 22.3431 26.8431 21 28.5 21C30.1569 21 31.5 22.3431 31.5 24C31.5 25.6569 30.1569 27 28.5 27C26.8431 27 25.5 25.6569 25.5 24Z" fill="#D9222A" />
                                                                <path d="M28.5 27C30.1569 27 31.5 25.6569 31.5 24C31.5 22.3431 30.1569 21 28.5 21" fill="#EE9F2D" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-white">{method.type} •••• {method.last4}</p>
                                                        {method.default && (
                                                            <span className="text-xs text-green-700 dark:text-green-400">Default</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                                                        <PenSquare size={18} />
                                                    </button>
                                                    {!method.default && (
                                                        <button className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                                                            <X size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
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