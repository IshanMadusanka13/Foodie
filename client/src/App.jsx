import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'leaflet/dist/leaflet.css';
import { Toaster } from 'react-hot-toast';

import Login from './pages/userService/login';
import Register from './pages/userService/register';
import Home from './pages/Home';
import Profile from './pages/userService/profile';

import JoinUs_Restaurant from './pages/RestaurantService/JoinUs_RestaurantMain';
import RestaurantList from './pages/RestaurantService/RestaurantList';
import RestaurantProfile from './pages/RestaurantService/RestaurantProfile ';

function App() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/joinUs" element={<JoinUs_Restaurant />} />
      <Route path="/restaurant" element={<RestaurantList />} />
      <Route path="/restaurant/:id" element={<RestaurantProfile />} />

    </Routes>
  )
}

export default App
