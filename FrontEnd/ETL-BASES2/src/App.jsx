
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import './App.css'
import LlenadoCustommers from './LlenadoCustommers';
import Inicio from './Inicio';
import ETLForm from './ETL';

function App() {
  

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/etl" element={<ETLForm />} />
      <Route path="/hechos" element={<LlenadoCustommers />} />
    </Routes>
  </Router>
  )
}

export default App
