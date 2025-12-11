import React, { useState } from 'react'
import './App.css'
import api from './api.js'
import { Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Analyse from "./pages/Analyse";
import Account from './pages/Account';
// import Login from './pages/Login.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analyse" element={<Analyse />} />
      <Route path="/account" element={<Account />} />
      {/* <Route path="/login" element={<Login />} /> */}

    </Routes>

  )
}

export default App
