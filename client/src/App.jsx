import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/userService/login';
import Register from './pages/userService/register';
import Home from './pages/Home';
import Profile from './pages/userService/profile';
import Order from './pages/orderService/order';
import DeliverLocation from './pages/orderService/deliverLocation';
import Delivery from './pages/Delivery';
import DeliveryTracking from './components/DeliveryTracking';

function App() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/pickup" element={<DeliverLocation />} />
      <Route path="/order" element={<Order />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/delivery/:orderId" element={<DeliveryTracking />} />
    </Routes>
  )
}

export default App
