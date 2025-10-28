import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function Pago() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    numeroTarjeta: "",
    vencimiento: "",
    cvv: "",
  });

  const [user, setUser] = useState(null);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedUser) setUser(storedUser);
    setCarrito(storedCart);
    console.log("🛍️ Carrito cargado en Pago.js:", storedCart);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión para realizar el pago.");
      navigate("/login");
      return;
    }

    try {
      // 1️⃣ Crear Pedido
      const pedidoData = {
        buyerId: parseInt(user.id),
        total: carrito.reduce((acc, item) => acc + (item.total || item.precio * item.cantidad), 0),
        status: "PENDIENTE",
      };

      const pedidoRes = await fetch("/pedidos/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoData),
      });
      const pedido = await pedidoRes.json();

      // 2️⃣ Crear cada Pedido_Item
      for (let item of carrito) {
        const itemData = {
          pedidoId: pedido.orderId,          // ID del pedido generado
          productoId: item.id,               // ID del producto
          usuarioId: item.vendedorId,        // ID del vendedor
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          total: item.total || item.precio * item.cantidad,
          estado: "PENDIENTE",
        };

        await fetch("/pedidoitems/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
      }

      // 3️⃣ Limpiar carrito y mostrar confirmación
      localStorage.removeItem("cart");
      alert("✅ Pedido guardado correctamente. ¡Gracias por tu compra!");
      navigate("/productos");
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar el pedido. Intenta nuevamente.");
    }
  };

  return (
    <>
      <Header />
      <div className="container py-5 d-flex justify-content-center">
        <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
          <h2 className="text-center mb-4 text-success">💳 Pago con Tarjeta</h2>

          {user && (
            <div className="mb-4 p-3 border rounded bg-light">
              <h5 className="fw-bold">Datos del Usuario</h5>
              <p className="mb-1"><strong>Nombre:</strong> {user.nombre} {user.apellidos}</p>
              <p className="mb-1"><strong>DNI:</strong> {user.dni}</p>
              <p className="mb-1"><strong>Teléfono:</strong> {user.telefono}</p>
              <p className="mb-1"><strong>Dirección:</strong> {user.direccion}</p>
              <p className="mb-0"><strong>Correo:</strong> {user.correo}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Nombre en la Tarjeta</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Número de Tarjeta</label>
              <input
                type="text"
                className="form-control"
                name="numeroTarjeta"
                value={formData.numeroTarjeta}
                onChange={handleChange}
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength="19"
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label fw-bold">Vencimiento</label>
                <input
                  type="month"
                  className="form-control"
                  name="vencimiento"
                  value={formData.vencimiento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <label className="form-label fw-bold">CVV</label>
                <input
                  type="password"
                  className="form-control"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mt-3">
              Confirmar y Pagar
            </button>
          </form>

          <button
            className="btn btn-secondary w-100 mt-3"
            onClick={() => navigate("/carrito")}
          >
            ← Volver al Carrito
          </button>
        </div>
      </div>
    </>
  );
}

export default Pago;
