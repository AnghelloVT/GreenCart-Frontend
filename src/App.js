import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import ProductList from './ProductList';
import UsuarioList from './UserList';
import VendedorPage from './VendedorPage';


export default function App() {
  return (

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="*" element={<ProductList />} />
    </Routes>

  );
}
