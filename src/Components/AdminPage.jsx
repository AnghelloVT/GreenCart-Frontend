import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserTie,
  FaCommentDots
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Estilos/AdminSideBar.css";
import logo from "../img/logo.jpg"; 

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [nombreAdmin, setNombreAdmin] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("registroUsuario"));
    if (usuario && usuario.firstName) setNombreAdmin(usuario.firstName);
    else setNombreAdmin("Administrador");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo-link">
        <img src={logo} alt="Logo" className="sidebar-logo-img" />
      </div>

      {/* Usuario */}
      <div className="sidebar-welcome">
        <FaUserTie className="sidebar-admin-icon" />
        <div>
          <p className="sidebar-welcome-title">Bienvenido</p>
          <p className="sidebar-welcome-name">{nombreAdmin}</p>
        </div>
      </div>

      <hr />

      {/* Navegación */}
      <ul className="nav flex-column mb-auto">

        <li>
          <Link
            to="/admin"
            className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}
          >
            <FaHome className="me-2" /> Inicio
          </Link>
        </li>

        <li>
          <Link
            to="/admin/usuarios"
            className={`nav-link ${location.pathname.includes("usuarios") ? "active" : ""}`}
          >
            <FaUsers className="me-2" /> Usuarios
          </Link>
        </li>

        <li>
          <Link
            to="/admin/productos"
            className={`nav-link ${location.pathname.includes("productos") ? "active" : ""}`}
          >
            <FaBoxOpen className="me-2" /> Productos
          </Link>
        </li>

        <li>
          <Link
            to="/admin/ventas"
            className={`nav-link ${location.pathname.includes("ventas") ? "active" : ""}`}
          >
            <FaShoppingCart className="me-2" /> Ventas
          </Link>
        </li>

        <li>
          <Link
            to="/admin/reclamos"
            className={`nav-link ${location.pathname.includes("reclamos") ? "active" : ""}`}
          >
            <FaCommentDots className="me-2" /> Reclamos
          </Link>
        </li>

      </ul>

      <hr />

      {/* Cerrar sesión */}
      <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
        <FaSignOutAlt className="me-2" /> Cerrar sesión
      </button>
    </nav>
  );
}
