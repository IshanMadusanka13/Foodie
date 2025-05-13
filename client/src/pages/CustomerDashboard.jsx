import { useState, useContext } from 'react';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    HomeIcon,
    UserIcon,
} from '@heroicons/react/solid';
import { FaUtensils, FaHandshake } from "react-icons/fa";
import RestaurantList from './RestaurantService/RestaurantList';
import CustomerMenuList from './MenuItemService/CustomerMenuList';
import JoinUs from './RestaurantService/JoinUs';
import CreateRestaurant from './RestaurantService/CreateRestaurant';
import MyRestaurants from './RestaurantService/MyRestaurants';
import Profile from './userService/profile';
import { useAuth } from '../hooks/useAuth';
import ManageRestaurants from './RestaurantService/ManageRestaurants';
import { ThemeContext } from '../contexts/ThemeContext';
import RestaurantProfileRA from './RestaurantService/RestaurantProfileRA';

const CustomerDashboard = () => {
    const { currentUser } = useAuth();
    const { darkMode } = useContext(ThemeContext);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const [activeViewParams, setActiveViewParams] = useState({});

    // Theme color definitions
    const theme = {
        background: darkMode ? 'bg-gray-900' : 'bg-gray-50',
        sidebarBackground: darkMode ? 'bg-gray-800' : 'bg-white',
        textPrimary: darkMode ? 'text-gray-100' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
        textAccent: darkMode ? 'text-primary-400' : 'text-primary-600',
        border: darkMode ? 'border-gray-700' : 'border-gray-200',
        hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
        activeBg: darkMode ? 'bg-primary-500/10' : 'bg-primary-100',
        button: {
            primary: darkMode
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'bg-primary-600 text-white hover:bg-primary-700',
            secondary: darkMode
                ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
    };

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard':
                return <CustomerMenuList />;
            case 'restaurants':
                return (
                    <div className="p-6">
                        {currentUser?.role === 'ADMIN' ?
                            <ManageRestaurants /> :
                            <RestaurantList />
                        }
                    </div>
                );
            case 'profile':
                return (
                    <div className="p-6">
                        {currentUser?.role === 'RESTAURANT' ?
                            <MyRestaurants /> :
                            <Profile />
                        }
                    </div>
                );
            case 'join_Us':
                return (
                    <div className="p-6">
                        {currentUser?.role === 'RESTAURANT' ? (
                            <JoinUs setActiveView={setActiveView} />
                        ) : (
                            <div className={`text-center space-y-4 mt-16 ${theme.textPrimary}`}>
                                <h2 className={`text-2xl font-semibold ${theme.textPrimary}`}>
                                    Want to partner with us?
                                </h2>
                                <p className={theme.textSecondary}>
                                    Sign up as a <span className={`font-medium ${theme.textAccent}`}>
                                        Restaurant Admin
                                    </span> to join our platform.
                                </p>
                                <a
                                    href="/register"
                                    className={`inline-block px-5 py-2 rounded-lg transition ${theme.button.primary}`}
                                >
                                    Sign Up
                                </a>
                            </div>
                        )}
                    </div>
                );
            case 'createRestaurant':
                return (
                    <div className="p-6">
                        <CreateRestaurant setActiveView={setActiveView} />
                    </div>
                );
            case 'restaurantProfile':
                return <RestaurantProfileRA
                    setActiveView={setActiveView}
                    restaurantId={activeViewParams.restaurantId}
                           />;
            default:
                return <div>Select a view</div>;
        }
    };

    // When navigating to restaurant profile:
    const navigateToRestaurant = (restaurantId) => {
        setActiveView('restaurantProfile');
        setActiveViewParams({ restaurantId });
    };

    return (
        <div className={`flex h-screen ${theme.background} ${theme.textPrimary}`}>
            {/* Collapsible Sidebar */}
            <div className={`shadow-md ${theme.sidebarBackground} ${sidebarCollapsed ? 'w-16' : 'w-56'} transition-all duration-300`}>
                {/* Sidebar Header */}
                <div className={`flex items-center justify-between p-4 border-b ${theme.border} h-16`}>
                    {!sidebarCollapsed && <h2 className="text-xl font-bold text-primary-500">Foodie</h2>}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={`p-1 rounded-md ${theme.hover}`}
                    >
                        {sidebarCollapsed ?
                            <ChevronDoubleRightIcon className="h-5 w-5" /> :
                            <ChevronDoubleLeftIcon className="h-5 w-5" />
                        }
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="p-2">
                    <ul className="space-y-1">
                        {[
                            { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
                            { id: 'restaurants', icon: FaUtensils, label: 'Restaurants' },
                            { id: 'profile', icon: UserIcon, label: 'User Profile' },
                            { id: 'join_Us', icon: FaHandshake, label: 'Join Us' }
                        ].map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveView(item.id)}
                                    className={`flex items-center p-3 rounded-lg w-full text-left transition-colors ${activeView === item.id
                                            ? `${theme.activeBg} ${theme.textAccent}`
                                            : `${theme.textSecondary} ${theme.hover}`
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="flex-1 overflow-auto">
                {renderActiveView()}
            </div>
        </div>
    );
};

export default CustomerDashboard;