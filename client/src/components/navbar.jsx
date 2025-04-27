import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const { currentUser, logout } = useAuth(); // Use currentUser from auth context
    const navigate = useNavigate();

    const signout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <nav className="relative px-4 py-4 flex justify-between items-center bg-white">
                {/* Logo */}
                <a className="text-3xl font-bold leading-none" href="#">
                    {/* Logo SVG */}
                    <div className="font-bold text-primary-600 text-3xl text-black">
                        <h1>Foodie</h1>
                    </div>   
                </a>

                {!currentUser ? (
                    <>
                        <div className="hidden lg:flex items-center space-x-4">
                            <a
                                className="py-2 px-6 bg-primary-500 hover:bg-primary-600 text-sm text-white font-bold rounded-xl transition duration-200"
                                href="/login"
                            >
                                Sign In
                            </a>
                            <a
                                className="py-2 px-6 bg-primary-500 hover:bg-primary-600 text-sm text-white font-bold rounded-xl transition duration-200"
                                href="/register"
                            >
                                Register
                            </a>
                        </div>

                        <div className="lg:hidden">
                            <div className="flex space-x-2">                           
                                <a
                                    className="py-2 px-4 bg-primary-500 hover:bg-primary-600 text-sm text-white font-bold rounded-xl transition duration-200"
                                    href="/login"
                                >
                                    Sign In
                                </a>
                                <a
                                    className="py-2 px-4 bg-primary-500 hover:bg-primary-600 text-sm text-white font-bold rounded-xl transition duration-200"
                                    href="/register"
                                >
                                    Register
                                </a>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="hidden lg:flex items-center space-x-4">
                            <a
                                className="py-2 px-6 bg-primary-500 hover:bg-primary-600 text-sm text-white font-bold rounded-xl transition duration-200"
                                href="/profile"
                            >
                                Profile
                            </a>
                            <button
                                onClick={signout}
                                className="py-2 px-6 bg-primary-500 hover:bg-primary-600 text-sm text-white font-bold rounded-xl transition duration-200"
                            >
                                Sign Out
                            </button>
                        </div>

                        <div className="lg:hidden">
                            <a
                                className="py-2 px-4 bg-primary-500 hover:bg-primary-600 text-sm text-white font-bold rounded-xl transition duration-200"
                                href="/profile"
                            >
                                Profile
                            </a>
                            <div className="flex space-x-2">
                                <button
                                    onClick={signout}
                                    className="py-2 px-4 bg-primary-500 hover:bg-primary-600 text-sm text-white font-bold rounded-xl transition duration-200"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
};

export default NavBar;