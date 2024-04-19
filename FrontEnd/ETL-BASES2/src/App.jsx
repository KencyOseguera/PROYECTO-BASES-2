
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import './App.css'
import LlenadoCustommers from './LlenadoCustommers';
import LlenadoEmployees from './LlenadoEmployees';
import Inicio from './Inicio';
function App() {
  

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/Customers" element={<LlenadoCustommers />} />
      <Route path="/Employees" element={<LlenadoEmployees />} />
    </Routes>
  </Router>
  )
}

export default App
