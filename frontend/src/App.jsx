import React, { useState } from 'react'
import './App.css'
import api from './api.js'
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Analyse from "./pages/Analyse";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analyse" element={<Analyse />} />

    </Routes>

  )
}

export default App
