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
      const pedidoData = {
        buyerId: parseInt(user.id),
        total: carrito.reduce((acc, item) => acc + (item.total || item.precio * item.cantidad), 0),
        status: "PENDIENTE",
      };

      const pedidoRes = await fetch("https://greencart-backend-085d.onrender.com/pedidos/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoData),
      });
      const pedido = await pedidoRes.json();

      console.log("Pedido creado:", pedido);

      for (let item of carrito) {
        const itemData = {
          orderId: pedido.orderId,
          productId: item.productId,
          sellerId: item.sellerId,
          quantity: item.quantity,
          unitPrice: item.productPrice,
          total: item.total || item.productPrice * item.quantity,
          status: "PENDIENTE",
        };

        console.log(itemData);

        await fetch("/pedidoitems/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemData),
        });
        
        const productRes = await fetch(`https://greencart-backend-085d.onrender.com/productos/${item.productId}`);
        const productActual = await productRes.json();

        const stockUpdate = {
          productId: item.productId,
          productStock: productActual.productStock - item.quantity,
        };

        await fetch(`https://greencart-backend-085d.onrender.com/productos/actualizar-stock/${item.productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stockUpdate),
        });
      }
      localStorage.setItem("ultimoPedido", JSON.stringify(pedido));

      const resumenItems = carrito.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.productPrice,
        total: item.total || item.productPrice * item.quantity,
        sellerId: item.sellerId
      }));

      localStorage.setItem("ultimoPedidoItems", JSON.stringify(resumenItems));

      localStorage.removeItem("cart");
      navigate("/resumen");
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

          {user && carrito.length > 0 && (
            <div className="mb-4 p-3 border rounded bg-light">
              <h5 className="fw-bold">🛒 Resumen del Carrito</h5>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>S/ {item.productPrice.toFixed(2)}</td>
                      <td>S/ {(item.total || item.productPrice * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-end fw-bold">Total</td>
                    <td className="fw-bold">
                      S/ {carrito.reduce((acc, item) => acc + (item.total || item.productPrice * item.quantity), 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
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
