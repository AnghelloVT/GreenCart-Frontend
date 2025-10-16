import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="*" element={<h2>Página no encontrada</h2>} />
    </Routes>
  );
}
