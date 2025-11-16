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
      ? `${user.nombre ?? user.firstName ?? ""} ${user.apellidos ?? user.lastName ?? ""}`.trim()
      : "Invitado";

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      {/* IZQUIERDA: LOGO + PRODUCTOS + CARRITO */}
      <div style={styles.leftSection}>
        {/* LOGO */}
        <h1 style={styles.title}>
          Green<span style={{ color: "#a5d6a7" }}>Cart</span>
        </h1>

        {/* PRODUCTOS */}
        {user && (
          <button
            style={styles.linkBtn}
            onClick={() => navigate("/productos")}
          >
            Productos
          </button>
        )}

        {/* CARRITO NEGRO */}
        {user && (
          <div style={styles.cartWrapper} onClick={() => navigate("/carrito")}>
            <FaShoppingCart size={22} style={{ color: "black" }} />

            {cart.length > 0 && (
              <span style={styles.cartCount}>{cart.length}</span>
            )}
          </div>
        )}
      </div>

      {/* DERECHA: BIENVENIDO + LOGOUT OR LOGIN */}
      <nav style={styles.rightSection}>
        {!user ? (
          <>
            <a href="/login" style={styles.buttonLink}>Iniciar Sesión</a>
            <a href="/registro" style={styles.buttonLink}>Registrarse</a>
          </>
        ) : (
          <>
            <span style={styles.welcome}>Bienvenido, {nombre}</span>
            <button onClick={logout} style={styles.logoutBtn}>
              Cerrar Sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

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

  /** IZQUIERDA **/
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
  },

  title: {
    margin: 0,
    fontSize: "2.2rem",
    fontWeight: "bold",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  linkBtn: {
    backgroundColor: "white",
    color: "black",
    borderRadius: "20px",
    padding: "0.4rem 1.1rem",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
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

  /** DERECHA **/
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  welcome: {
    fontWeight: "600",
    fontSize: "1.1rem",
  },

  buttonLink: {
    backgroundColor: "#ffffff",
    color: "black",
    borderRadius: "20px",
    padding: "0.5rem 1.25rem",
    textDecoration: "none",
    fontWeight: "600",
    boxShadow: "0 4px 8px rgba(102,187,106,0.4)",
  },

  logoutBtn: {
    backgroundColor: "#b82323",
    border: "none",
    padding: "0.5rem 1.25rem",
    cursor: "pointer",
    fontWeight: "600",
    borderRadius: "20px",
    color: "white",
    boxShadow: "0 4px 8px rgba(129,199,132,0.5)",
  },
};
