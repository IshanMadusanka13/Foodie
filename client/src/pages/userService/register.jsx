import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        address: '',
        phone_number: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log(errors)
            return;
        }

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone_number,
            address: formData.address,
            profileImage: null,
            role: 'CUSTOMER'
        };

        const result = await register(userData);

        if (result.success) {
            navigate('/login');
        } else {
            setErrors(prev => ({
                ...prev,
                form: result.error
            }));
        }

    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.firstName = 'Name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Phone number must be 10 digits';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        return newErrors;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-700 to-primary-500 dark:from-slate-900 dark:to-green-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="Foodie Logo" className="h-16 w-30 mx-auto" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Join us to enjoy fast food delivery!</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl backdrop-blur-sm backdrop-filter bg-opacity-80 dark:bg-opacity-80 p-8 border border-gray-200 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 dark:bg-slate-700 dark:text-white"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 dark:bg-slate-700 dark:text-white"
                                    placeholder="07x 2345 6789"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Address
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 dark:bg-slate-700 dark:text-white"
                                    placeholder="123 Main St, City, Country"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 dark:bg-slate-700 dark:text-white"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 dark:bg-slate-700 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 dark:bg-slate-700 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${errors.acceptTerms ? 'border-red-300' : ''}`}
                            />
                            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                I accept the <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms and Conditions</a>
                            </label>
                        </div>

                        {/* Error messages section - add this before the submit button */}
                        {(errors.general || Object.keys(errors).length > 0) && (
                            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                                {errors.general && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                                )}

                                {Object.entries(errors).map(([field, message]) => (
                                    field !== 'general' && message && (
                                        <p key={field} className="text-sm text-red-600 dark:text-red-400">
                                            {message}
                                        </p>
                                    )
                                ))}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#208C27] to-[#36BF3F] hover:from-[#16601d] hover:to-[#2eaa36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#36BF3F] transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;