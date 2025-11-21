import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";

function Resumen() {
  const navigate = useNavigate();
  const { orderId } = useParams(); 
  const [pedido, setPedido] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (orderId) {
      // ver pedido guardado desde "MisPedidos"
      fetch(`http://localhost:8080/pedidos/${orderId}`)
        .then(res => {
          if (!res.ok) throw new Error("Error al obtener el pedido");
          return res.json();
        })
        .then(data => {
          setPedido(data);
          setItems(data.items || []);
        })
        .catch(err => console.error(err));
    } else {
    const storedPedido = JSON.parse(localStorage.getItem("ultimoPedido"));
    const storedItems = JSON.parse(localStorage.getItem("ultimoPedidoItems")) || [];

    if (!storedPedido) {
      navigate("/productos"); //si no hay pedido, redirige
      return;
    }

    setPedido(storedPedido);
    setItems(storedItems);
  }
  }, [orderId, navigate]);

  // Función para descargar el PDF
  const descargarPDF = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/pedidos/${orderId}/pdf`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        alert("Error al generar el PDF");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Pedido_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar PDF:", error);
    }
  };

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
          <button
            className="btn btn-primary ms-3"
            onClick={() => descargarPDF(pedido.orderId)}
          >
            Descargar PDF
          </button>
        </h4>
      </div>
    </>
  );
}

export default Resumen;
