import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import ProductList from "./Components/ProductList";
import VendedorPage from "./Components/VendedorPage";
import AdminPage from "./Components/AdminPage";
import Cart from "./Components/Cart";
import Pago from "./Components/Pago";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/productos" element={<ProductList />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/pago" element={<Pago />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/vendedor" element={<VendedorPage />} />
      <Route path="*" element={<ProductList />} />
    </Routes>
  );
}