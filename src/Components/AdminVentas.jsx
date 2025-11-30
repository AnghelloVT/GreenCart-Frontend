import React, { useEffect, useState, useCallback } from "react";
import AdminPage from "./AdminPage";
import "../Estilos/AdminUsuarios.css"; 
import Swal from "sweetalert2";

export default function AdminVentas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [idBuscar, setIdBuscar] = useState("");
  const [correoBuscar, setCorreoBuscar] = useState("");

  // Normaliza los datos de ventas
  const normalizarVenta = (v) => ({
    id: v.orderId,
    comprador: v.buyerId, 
    fecha: v.date ? new Date(v.date).toLocaleString() : "N/A",
    total: v.total?.toFixed(2) || "0.00",
    estado: v.status || "N/A",
  });

  const fetchVentas = useCallback(async () => {
    setCargando(true);
    try {
      const res = await fetch("https://greencart-backend-085d.onrender.com/pedidos/all");
      if (!res.ok) throw new Error("Error al cargar las ventas");
      const data = await res.json();
      setVentas(data.map(normalizarVenta));
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las ventas", "error");
    } finally {
      setCargando(false);
    }
  }, []);

  const buscarPorId = async () => {
    if (!idBuscar) return;
    setCargando(true);
    try {
      const res = await fetch(`https://greencart-backend-085d.onrender.com/pedidos/${idBuscar}`);
      if (!res.ok) throw new Error("Venta no encontrada");
      const data = await res.json();
      setVentas([normalizarVenta(data)]);
    } catch {
      Swal.fire("Error", "No se encontró la venta", "error");
    } finally {
      setCargando(false);
    }
  };

  const buscarPorCorreo = async () => {
    if (!correoBuscar) return;
    setCargando(true);
    try {
      const res = await fetch(`https://greencart-backend-085d.onrender.com/pedidos/all`);
      if (!res.ok) throw new Error("Error al buscar ventas");
      const data = await res.json();
      const filtradas = data
        .map(normalizarVenta)
        .filter((v) =>
          String(v.comprador).toLowerCase().includes(correoBuscar.toLowerCase())
        );
      setVentas(filtradas);
    } catch {
      Swal.fire("Error", "Error al buscar ventas por correo", "error");
    } finally {
      setCargando(false);
    }
  };

  const reset = () => {
    setIdBuscar("");
    setCorreoBuscar("");
    fetchVentas();
  };

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]); 

  return (
    <div>
      <AdminPage />
      <main style={{ marginLeft: 240, padding: 40 }}>
        <h1>💰 Ventas</h1>

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
            placeholder="Buscar por comprador"
            value={correoBuscar}
            onChange={(e) => setCorreoBuscar(e.target.value)}
          />
          <button className="btn-buscar" onClick={buscarPorCorreo}>
            Buscar
          </button>

          <button className="btn-listar" onClick={reset}>
            Listar
          </button>
        </div>

        {cargando ? (
          <p>Cargando ventas...</p>
        ) : (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>ID Comprador</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.comprador}</td>
                  <td>{v.fecha}</td>
                  <td>S/ {v.total}</td>
                  <td>{v.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
