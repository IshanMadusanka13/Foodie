import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/userService/login';
import Register from './pages/userService/register';
import Home from './pages/Home';
import Profile from './pages/userService/profile';

function App() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App
