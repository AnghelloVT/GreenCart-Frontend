import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../Context/CartContext";

export default function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();

  // Obtener usuario
  let user = null;
  try {
    user =
      JSON.parse(localStorage.getItem("user")) ??
      JSON.parse(localStorage.getItem("usuario"));
  } catch {
    user = null;
  }

  const nombre =
    user
      ? `${user.nombre ?? user.firstName ?? ""} ${
          user.apellidos ?? user.lastName ?? ""
        }`.trim()
      : "Invitado";

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  // 🔹 Funciones de navegación
  const goToCart = () => navigate("/carrito");
  const goToProductos = () => navigate("/productos");
  const goToReclamos = () => navigate("/reclamos");
  const goToMisPedidos = () => navigate("/mis-pedidos");

  return (
    <header style={styles.header}>
      {/* IZQUIERDA */}
      <div style={styles.leftSection}>
        <h1 style={styles.title}>
          Green<span style={{ color: "#a5d6a7" }}>Cart</span>
        </h1>

        {user && (
          <button style={styles.linkBtn} onClick={goToProductos}>
            Productos
          </button>
        )}

        {/* CARRITO */}
        {user && (
          <div style={styles.cartWrapper} onClick={goToCart}>
            <FaShoppingCart size={22} style={{ color: "black" }} />

            {cart.length > 0 && (
              <span style={styles.cartCount}>{cart.length}</span>
            )}
          </div>
        )}
      </div>

      {/* DERECHA */}
      <div style={styles.rightSection}>
        {!user ? (
          <>
            <a href="/login" style={styles.buttonLink}>
              Iniciar Sesión
            </a>
            <a href="/registro" style={styles.buttonLink}>
              Registrarse
            </a>
          </>
        ) : (
          <>
            <span style={styles.welcome}>Bienvenido, {nombre}</span>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={goToMisPedidos}
            >
              📝 Mis Pedidos
            </button>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={goToReclamos}
            >
              Reclamos
            </button>

            <button style={styles.logoutBtn} onClick={logout}>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}

// ========================
// ESTILOS
// ========================
const styles = {
  header: {
    padding: "1rem 2rem",
    backgroundColor: "#2e7d32",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
  },

  title: {
    margin: 0,
    fontSize: "2.2rem",
    fontWeight: "bold",
  },

  linkBtn: {
    backgroundColor: "white",
    color: "black",
    borderRadius: "20px",
    padding: "0.4rem 1.1rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
  },

  cartWrapper: {
    position: "relative",
    cursor: "pointer",
  },

  cartCount: {
    position: "absolute",
    top: -8,
    right: -10,
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "0.7rem",
    fontWeight: "bold",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  buttonLink: {
    backgroundColor: "#ffffff",
    color: "black",
    borderRadius: "20px",
    padding: "0.5rem 1.25rem",
    fontWeight: "600",
    textDecoration: "none",
  },

  welcome: {
    fontWeight: "600",
    fontSize: "1.1rem",
  },

  logoutBtn: {
    backgroundColor: "#b82323",
    border: "none",
    padding: "0.5rem 1.25rem",
    cursor: "pointer",
    fontWeight: "600",
    borderRadius: "20px",
    color: "white",
  },
};
