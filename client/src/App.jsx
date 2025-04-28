import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/userService/login';
import Register from './pages/userService/register';
import Home from './pages/Home';
import Delivery from './pages/Delivery';
import DeliveryTracking from './components/DeliveryTracking';

function App() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/delivery/:deliveryId" element={<DeliveryTracking />} />
    </Routes>
  )
}

export default App
