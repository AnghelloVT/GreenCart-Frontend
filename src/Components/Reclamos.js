import React, { useState, useEffect } from "react";

export default function Reclamos() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    dni: "",
    telefono: "",
    direccion: "",
    fecha: new Date().toISOString().split("T")[0],
    motivo: "",
    detalle: "",
  });

  // ✅ Al cargar la página, llenar los campos con los datos del usuario logueado
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setForm((prevForm) => ({
        ...prevForm,
        nombre: `${storedUser.nombre} ${storedUser.apellidos || ""}`,
        correo: storedUser.correo || "",
        dni: storedUser.dni || "",
        telefono: storedUser.telefono || "",
        direccion: storedUser.direccion || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Envía el reclamo al backend con el id_usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.detalle.length > 1000) {
      alert("El detalle no puede superar los 1000 caracteres.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const idUsuario = storedUser?.id;

    try {
      const response = await fetch(
        `http://localhost:8080/api/reclamos/guardar?idUsuario=${idUsuario}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        alert("✅ Reclamo enviado correctamente.");
        setForm({ ...form, motivo: "", detalle: "" });
      } else {
        alert("❌ Ocurrió un error al enviar el reclamo.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <div className="container mt-5 mb-5 p-4 shadow rounded bg-light">
      <h2 className="text-center text-success mb-4">
        📖 Libro de Reclamaciones
      </h2>

      <form onSubmit={handleSubmit}>
        <h5 className="text-success">Identificación del Consumidor</h5>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nombre y Apellidos</label>
            <input
              name="nombre"
              className="form-control"
              value={form.nombre}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              name="correo"
              type="email"
              className="form-control"
              value={form.correo}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">DNI</label>
            <input
              name="dni"
              className="form-control"
              value={form.dni}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Teléfono</label>
            <input
              name="telefono"
              className="form-control"
              value={form.telefono}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Dirección</label>
            <input
              name="direccion"
              className="form-control"
              value={form.direccion}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>

        <h5 className="text-success mt-4">Detalle del Reclamo</h5>

        <div className="mb-3">
          <label className="form-label">Motivo</label>
          <select
            name="motivo"
            className="form-select"
            value={form.motivo}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="producto">Producto</option>
            <option value="servicio">Servicio</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Detalle (máx. 1000 caracteres)</label>
          <textarea
            name="detalle"
            className="form-control"
            rows="5"
            value={form.detalle}
            onChange={handleChange}
            maxLength="1000"
            required
          ></textarea>
          <div className="form-text">{form.detalle.length}/1000 caracteres</div>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Enviar Reclamo
        </button>
      </form>
    </div>
  );
}
