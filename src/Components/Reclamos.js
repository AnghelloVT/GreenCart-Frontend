import React, { useState, useEffect } from "react";
import Header from "./Header";
import "../Estilos/Reclamos.css";
import Swal from "sweetalert2";

export default function Reclamos() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correo: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaPedido: "",
    motivo: "",
    detalle: "",
    aceptaTerminos: false,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nombreCompleto: `${user.nombre} ${user.apellidos || ""}`,
        correo: user.correo || "",
        dni: user.dni || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.aceptaTerminos) {
      Swal.fire({
        icon: "warning",
        title: "Terminos y Condiciones",
        text: "Debe aceptar los términos y condiciones antes de enviar.",
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      Swal.fire({
        icon: "error",
        title: "Usuario no autenticado",
        text: "Debe iniciar sesión para enviar un reclamo.",
      });
      return;
    }

    const nuevoReclamo = {
      fechaPedido: formData.fechaPedido,
      motivoReclamo: formData.motivo,
      detalle: formData.detalle,
      usuario: { id: user.id },
    };

    try {
      const res = await fetch("http://localhost:8080/reclamos/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoReclamo),
      });

      if (!res.ok) throw new Error("Error al enviar el reclamo");

      Swal.fire({
        icon: "success",
        title: "Reclamo enviado",
        text: "Tu reclamo ha sido registrado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData((prev) => ({
        ...prev,
        fechaPedido: "",
        motivo: "",
        detalle: "",
        aceptaTerminos: false,
      }));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: "No se pudo enviar el reclamo: " + err.message,
      });
    }
  };

  return (
    <>
      <Header />
      <div className="reclamo-container">
        <h2>📢 Formulario de Reclamo</h2>

        <form className="reclamo-form" onSubmit={handleSubmit}>
          {/* IDENTIFICACIÓN */}
          <section className="identificacion">
            <h3>👤 Identificación del Usuario</h3>

            <div className="grid-2">
              <div>
                <label>Nombre Completo</label>
                <input type="text" value={formData.nombreCompleto} readOnly />
              </div>

              <div>
                <label>Correo Electrónico</label>
                <input type="email" value={formData.correo} readOnly />
              </div>

              <div>
                <label>DNI</label>
                <input type="text" value={formData.dni} readOnly />
              </div>

              <div>
                <label>Teléfono</label>
                <input type="text" value={formData.telefono} readOnly />
              </div>

              <div className="full-width">
                <label>Dirección</label>
                <input type="text" value={formData.direccion} readOnly />
              </div>
            </div>
          </section>

          {/* DETALLE */}
          <section className="detalle-reclamo">
            <h3>🧾 Detalle de Reclamación</h3>

            <div className="grid-2">
              <div>
                <label>Fecha del Pedido</label>
                <input
                  type="date"
                  name="fechaPedido"
                  value={formData.fechaPedido}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Motivo del Reclamo</label>
                <select
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un motivo</option>
                  <option value="Producto defectuoso">Producto defectuoso</option>
                  <option value="Demora en la entrega">Demora en la entrega</option>
                  <option value="Pedido incompleto">Pedido incompleto</option>
                  <option value="Error en el producto recibido">
                    Error en el producto recibido
                  </option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="full-width">
                <label>Detalle del Reclamo</label>
                <textarea
                  name="detalle"
                  value={formData.detalle}
                  onChange={handleChange}
                  placeholder="Describe el problema con detalle..."
                  required
                />
              </div>
            </div>

            {/* Términos */}
            <div className="terminos">
              <input
                type="checkbox"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
              />
              <label>
                Acepto los{" "}
                <a href="/terminos" target="_blank" rel="noopener noreferrer">
                  términos y condiciones
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="btn-enviar"
              disabled={!formData.aceptaTerminos}
            >
              Enviar Reclamo
            </button>
          </section>
        </form>
      </div>
    </>
  );
}
