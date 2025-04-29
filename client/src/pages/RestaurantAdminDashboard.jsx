import { useState } from 'react';
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    HomeIcon,
    ClockIcon,
    UserIcon,
} from '@heroicons/react/solid';
import { FaUtensils, FaHandshake } from "react-icons/fa";
import CustomerMenuList from './MenuItemService/CustomerMenuList';
import JoinUs from './RestaurantService/JoinUs';
import CreateRestaurant from './RestaurantService/CreateRestaurant';
import RestaurantListRA from './RestaurantService/RestaurantListRA';

const RestaurantAdminDashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <div>
                        <CustomerMenuList />
                    </div>
                );
            case 'restaurants':
                return (
                    <div className="p-6">
                        <RestaurantListRA />
                    </div>
                );
            case 'history':
                return (
                    <div className="p-6">
                        {/* Add your order history content here */}
                    </div>
                );
            case 'profile':
                return (
                    <div className="p-6">
                        {/* Add your profile content here */}
                    </div>
                );
            case 'join_Us':
                return (
                    <div className="p-6">
                        <JoinUs setActiveView={setActiveView} />
                    </div>
                );
            case 'createRestaurant':
                return (
                    <div className="p-6">
                        <CreateRestaurant setActiveView={setActiveView} />
                    </div>
                );
            
            default:
                return <div>Select a view</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Collapsible Sidebar */}
            <div className={`bg-white shadow-md ${sidebarCollapsed ? 'w-15' : 'w-48'} transition-all duration-300`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
                    {!sidebarCollapsed && <h2 className="text-xl font-bold text-primary-600">Foodie</h2>}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
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
                        <li>
                            <button
                                onClick={() => setActiveView('dashboard')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'dashboard' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <HomeIcon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>Dashboard</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('restaurants')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'restaurants' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <FaUtensils className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>Restaurants</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('history')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'history' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <ClockIcon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>Order History</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('profile')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'profile' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <UserIcon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>User Profile</span>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('join_Us')}
                                className={`flex items-center p-3 rounded-lg w-full text-left ${activeView === 'join_Us' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <FaHandshake className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>Join Us</span>}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="flex-1 overflow-auto">
                {renderActiveView()}
            </div>

        </div>
    );
};

export default RestaurantAdminDashboard;

