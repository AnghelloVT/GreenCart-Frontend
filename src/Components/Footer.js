import React from "react";
import { FaFacebookF } from "react-icons/fa";
import Libro from "../img/LIBRO.png";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.centerIcons}>
        {/* Redes sociales decorativas */}
        <div style={styles.icon}>
          <FaFacebookF size={22} />
        </div>
        <div
          style={styles.icon}
          dangerouslySetInnerHTML={{
            __html: `
              <svg width="22" height="22" fill="white" viewBox="0 0 1200 1227">
                <path d="M714 519L1187 0H979L521 510 178 0H0l474 677L0 1227h208l347-412 347 412h178L714 519z"/>
              </svg>
            `,
          }}
        />
      </div>

      <a href="/reclamos" style={styles.bookContainer} title="Libro de Reclamaciones">
        <img src={Libro} alt="Libro de reclamaciones" style={styles.bookImage} />
      </a>

      <p style={styles.copy}>
        &copy; {new Date().getFullYear()} GreenCart — Todos los derechos reservados.
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    position: "relative",
    backgroundColor: "#121212",
    color: "white",
    padding: "20px 40px 30px 40px",
    textAlign: "center",
    minHeight: "90px",
  },
  centerIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    alignItems: "center",
    marginBottom: "6px",
  },
  icon: {
    color: "white",
    background: "rgba(255,255,255,0.15)",
    padding: "10px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bookContainer: {
    position: "absolute",
    bottom: "25px",   // subido un poco respecto al borde inferior
    right: "30px",    // espacio suficiente a la derecha
    cursor: "pointer",
  },
  bookImage: {
    height: "60px",    // mayor tamaño pero sin agrandar mucho el footer
    width: "auto",
    display: "block",
  },
  copy: {
    fontSize: "0.9rem",
    opacity: 0.7,
    margin: 0,
    marginTop: "10px",  // menos espacio entre iconos y texto
  },
};
