import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import ProductList from "./Components/ProductList";
import VendedorPage from "./Components/VendedorPage";
import AdminPage from "./Components/AdminPage";
import Cart from "./Components/Cart";
import Pago from "./Components/Pago";
import Resumen from "./Components/Resumen";
import MisPedidos from "./Components/MisPedidos";
import Reclamos from "./Components/Reclamos";
import DashboardInicio from "./Components/AdminInicio";
import AdminReclamos from "./Components/AdminReclamos";
import AdminProductos from "./Components/AdminProductos";
import AdminUsuarios from "./Components/AdminUsuarios";
import AdminVentas from "./Components/AdminVentas";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/productos" element={<ProductList />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/pago" element={<Pago />} />
      <Route path="/resumen" element={<Resumen />} />
      <Route path="/admin" element={<DashboardInicio />} />
      <Route path="/resumen/:orderId" element={<Resumen />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/reclamos" element={<AdminReclamos />} />
      <Route path="/admin/productos" element={<AdminProductos />} />
      <Route path="/admin/usuarios" element={<AdminUsuarios />} />
      <Route path="/admin/ventas" element={<AdminVentas />} />
      <Route path="/vendedor" element={<VendedorPage />} />
      <Route path="/mis-pedidos" element={<MisPedidos />} />
      <Route path="*" element={<ProductList />} />
      <Route path="/reclamos" element={<Reclamos />} />
    </Routes>
  );
}
