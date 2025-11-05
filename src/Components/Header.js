import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const goToCart = () => {
    navigate("/carrito");
  };

  const goToMisPedidos = () => {
    navigate("/mis-pedidos"); 
  };

  return (
    <nav className="navbar navbar-light bg-light px-3 shadow-sm d-flex justify-content-between">
      <span className="navbar-text">
        👋 Bienvenido {user ? `${user.nombre} ${user.apellidos}` : "Invitado"}
      </span>
      <div>
        {user && (
          <>
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={goToCart}
            >
              🛒 Carrito
            </button>
            <button
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={goToMisPedidos}
            >
              📝 Mis Pedidos
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}