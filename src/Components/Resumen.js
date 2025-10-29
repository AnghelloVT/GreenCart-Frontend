import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function Resumen() {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedPedido = JSON.parse(localStorage.getItem("ultimoPedido"));
    const storedItems = JSON.parse(localStorage.getItem("ultimoPedidoItems")) || [];

    if (!storedPedido) {
      navigate("/productos"); //si no hay pedido, redirige
      return;
    }

    setPedido(storedPedido);
    setItems(storedItems);
  }, [navigate]);

  if (!pedido) return null;

  return (
    <>
      <Header />
      <div className="container py-5">
        <h1 className="mb-4 text-center text-success">¡Gracias por tu compra!</h1>
        <p><strong>Número de pedido:</strong> {pedido.orderId}</p>
        <p><strong>Fecha:</strong> {new Date(pedido.date).toLocaleString()}</p>
        <p><strong>Estado:</strong> {pedido.status}</p>

        <table className="table mt-4">
          <thead>
            <tr>
              <th>Producto</th>
              <th>ID Vendedor</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.sellerId}</td>
                <td>{item.quantity}</td>
                <td>S/ {item.unitPrice.toFixed(2)}</td>
                <td>S/ {item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="text-end mt-3">
          Total: S/ {items.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
        </h4>
      </div>
    </>
  );
}

export default Resumen;
