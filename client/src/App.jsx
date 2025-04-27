import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'

import 'leaflet/dist/leaflet.css';
import { Toaster } from 'react-hot-toast';

import Login from './pages/userService/login';
import Register from './pages/userService/register';
import Home from './pages/Home';
import Profile from './pages/userService/profile';

//Restaurant-customer


import JoinUs from './pages/RestaurantService/JoinUs';
import RestaurantList from './pages/RestaurantService/RestaurantList';
import RestaurantProfile from './pages/RestaurantService/RestaurantProfile ';
import CreateRestaurant from './pages/RestaurantService/CreateRestaurant';
import MenuItemCategory from './pages/MenuItemService/MenuItemCategory';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerMenuList from './pages/MenuItemService/CustomerMenuList';
import ManageRestaurants from './pages/RestaurantService/ManageRestaurants';
import AdminDashboard from './pages/adminDashboard';
import RestaurantAdminDashboard from './pages/RestaurantAdminDashboard';

import Cart from './pages/Cart';

function App() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/JoinUs" element={<JoinUs />} />
      <Route path="/restaurant" element={<RestaurantList />} />
      <Route path="/restaurant/:id" element={<RestaurantProfile />} />
      <Route path="/createRestaurant" element={<CreateRestaurant />} />
      <Route path="/menuItemCategory" element={<MenuItemCategory />} />
      <Route path="/customerDashboard" element={<CustomerDashboard />} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/customerMenuList" element={<CustomerMenuList />} />
      <Route path="/manageRestaurants" element={<ManageRestaurants />} />
      <Route path="/adminDashboard" element={<AdminDashboard />} />
      <Route path="/restaurantAdminDashboard" element={<RestaurantAdminDashboard />} />

    </Routes>
  )
}

export default App
