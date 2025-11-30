import React, { useEffect, useState } from "react";
import AdminPage from "./AdminPage";
import "../Estilos/AdminUsuarios.css";
import Swal from "sweetalert2";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [idBuscar, setIdBuscar] = useState("");
  const [correoBuscar, setCorreoBuscar] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editUser, setEditUser] = useState({
    id: "",
    nombre: "",
    apellidos: "",
    correo: "",
    dni: "",
    telefono: "",
  });

  const normalizarUsuario = (u) => {
    let roles = [];

    if (Array.isArray(u.roles)) {
      roles = u.roles.map((r) =>
        typeof r === "string" ? r : r.nombre || r.name || ""
      );
    }

    if (Array.isArray(u.rol)) {
      roles = u.rol.map((r) => r.nombre || r.name || "");
    }

    return {
      id: u.id,
      nombre: u.nombre || u.firstName || "",
      apellidos: u.apellidos || u.lastName || "",
      correo: u.correo || u.email || "",
      dni: u.dni || "",
      telefono: u.telefono || u.phone || "",
      roles: roles,
    };
  };

  const usuariosVisibles = usuarios.filter(
  (u) => !u.roles.some((r) => r.toLowerCase().includes("admin"))
);

  // Listar todos
  const fetchUsuarios = async () => {
    setCargando(true);
    try {
      const response = await fetch("https://greencart-backend-085d.onrender.com/usuarios/listar");
      const data = await response.json();
      setUsuarios(data.map(normalizarUsuario));
    } catch (error) {
      Swal.fire("Error", "Error al obtener usuarios", "error");
    } finally {
      setCargando(false);
    }
  };

  // Buscar por ID
  const buscarPorId = async () => {
    if (!idBuscar) return;

    setCargando(true);
    try {
      const res = await fetch(`https://greencart-backend-085d.onrender.com/usuarios/id/${idBuscar}`);
      const data = await res.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
        return;
      }

      setUsuarios([normalizarUsuario(data)]);
    } catch {
      Swal.fire("Error", "Error al buscar usuario por ID", "error");
    } finally {
      setCargando(false);
    }
  };

  // Buscar por correo
  const buscarPorCorreo = async () => {
    if (!correoBuscar) return;

    setCargando(true);
    try {
      const res = await fetch(
        `https://greencart-backend-085d.onrender.com/usuarios/correo/${correoBuscar}`
      );
      const data = await res.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
        return;
      }

      setUsuarios([normalizarUsuario(data)]);
    } catch {
      Swal.fire("Error", "Error al buscar usuario por correo", "error");
    } finally {
      setCargando(false);
    }
  };

  const reset = () => {
    setIdBuscar("");
    setCorreoBuscar("");
    fetchUsuarios();
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción es permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`https://greencart-backend-085d.onrender.com/usuarios/eliminar/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Eliminado", data.message, "success");
        fetchUsuarios();
      } else {
        Swal.fire("Error", data.error || "No se pudo eliminar", "error");
      }
    } catch {
      Swal.fire("Error", "Error al eliminar usuario", "error");
    }
  };

  const abrirEditar = (u) => {
    setEditUser({
      id: u.id,
      nombre: u.nombre,
      apellidos: u.apellidos,
      correo: u.correo,
      dni: u.dni,
      telefono: u.telefono,
    });

    setEditModal(true);
  };

  const guardarCambios = async () => {
    try {
      const res = await fetch(
        `https://greencart-backend-085d.onrender.com/usuarios/editar/${editUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editUser),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Actualizado", data.message, "success");
        setEditModal(false);
        fetchUsuarios();
      } else {
        Swal.fire("Error", data.error || "No se pudo actualizar", "error");
      }
    } catch {
      Swal.fire("Error", "Error al enviar la edición", "error");
    }
  };

  return (
    <div>
      <AdminPage />

      <main style={{ marginLeft: 240, padding: 40 }}>
        <h1>Usuarios</h1>

        {/* FILTROS */}
        <div className="filtros-usuarios">
          <input
            type="number"
            placeholder="Buscar por ID"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />
          <button className="btn-buscar" onClick={buscarPorId}>
            Buscar ID
          </button>

          <input
            type="text"
            placeholder="Buscar por correo"
            value={correoBuscar}
            onChange={(e) => setCorreoBuscar(e.target.value)}
          />
          <button className="btn-buscar" onClick={buscarPorCorreo}>
            Buscar Correo
          </button>

          <button className="btn-listar" onClick={reset}>
            Listar
          </button>
        </div>

        {cargando ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuariosVisibles.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>{u.dni}</td>
                  <td>{u.telefono}</td>
                  <td>{u.roles.length > 0 ? u.roles.join(", ") : "Sin rol"}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => abrirEditar(u)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MODAL */}
        {editModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Editar Usuario</h2>

              <label>Nombre</label>
              <input
                type="text"
                value={editUser.nombre}
                onChange={(e) =>
                  setEditUser({ ...editUser, nombre: e.target.value })
                }
              />

              <label>Apellidos</label>
              <input
                type="text"
                value={editUser.apellidos}
                onChange={(e) =>
                  setEditUser({ ...editUser, apellidos: e.target.value })
                }
              />

              <label>Correo</label>
              <input
                type="email"
                value={editUser.correo}
                onChange={(e) =>
                  setEditUser({ ...editUser, correo: e.target.value })
                }
              />

              <label>DNI</label>
              <input
                type="text"
                value={editUser.dni}
                onChange={(e) =>
                  setEditUser({ ...editUser, dni: e.target.value })
                }
              />

              <label>Teléfono</label>
              <input
                type="text"
                value={editUser.telefono}
                onChange={(e) =>
                  setEditUser({ ...editUser, telefono: e.target.value })
                }
              />

              <button className="btn-save" onClick={guardarCambios}>
                Guardar
              </button>

              <button className="btn-cancel" onClick={() => setEditModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
