import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  // Lee el usuario guardado. Soporta ambas claves: "user" o "usuario"
  let user = null;
  try {
    user =
      JSON.parse(localStorage.getItem("user")) ??
      JSON.parse(localStorage.getItem("usuario"));
  } catch (e) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const goToCart = () => navigate("/carrito");
  const goToProductos = () => navigate("/productos");
  const goToReclamos = () => navigate("/reclamos");

  const nombreCompleto =
    user
      ? `${user.nombre ?? user.firstName ?? ""} ${user.apellidos ?? user.lastName ?? ""}`.trim()
      : "Invitado";

  const goToMisPedidos = () => {
    navigate("/mis-pedidos"); 
  };

  return (
    <nav className="navbar navbar-light bg-light px-3 shadow-sm">
      <div className="container-fluid d-flex align-items-center">

        {/* Izquierda: Logo + Bienvenida */}
        <div className="d-flex align-items-center gap-2">
          {/* Ajusta la ruta del logo si es necesario */}
          <img src="/images/logo192.png" alt="GreenCart" style={{ width: 40, height: 40 }} />
          <span className="navbar-text">👋 Bienvenido {nombreCompleto || "Invitado"}</span>
        </div>

        {/* Centro: Carrito */}
        <div className="flex-grow-1 text-center">
          {user && (
            <>
            <button className="btn btn-outline-primary btn-sm" onClick={goToCart}>
              🛒 Carrito
            </button>
            <button
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={goToMisPedidos}
            >
              📝 Mis Pedidos
            </button>
            </>
          )}
        </div>

        {/* Derecha: Productos / Reclamos / Cerrar sesión */}
        <div className="d-flex align-items-center gap-2">
          {user && (
            <>
              <button className="btn btn-outline-success btn-sm" onClick={goToProductos}>
                Productos
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={goToReclamos}>
                Reclamos
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
