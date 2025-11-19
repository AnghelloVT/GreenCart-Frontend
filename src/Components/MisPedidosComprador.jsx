import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./MisPedidos.css";

export default function MisPedidosComprador() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        const endpoint = `http://localhost:8080/pedidos/mis-pedidos/${user.id}`;

        fetch(endpoint)
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar pedidos");
                return res.json();
            })
            .then(data => setPedidos(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [user]);

    const handleCancelarPedido = async (pedidoId) => {
        try {
            const response = await fetch(`http://localhost:8080/pedidos/${pedidoId}/cancelar`, {
                method: "POST",
            });
            if (!response.ok) throw new Error("No se pudo cancelar el pedido");
            alert("Pedido cancelado correctamente");
            // Actualizar la lista de pedidos
            setPedidos(pedidos.map(p => p.orderId === pedidoId ? { ...p, estado: "CANCELADO" } : p));
        } catch (error) {
            console.error(error);
            alert("Error al cancelar el pedido");
        }
    };

    const handleEntregarPedido = async (pedidoId) => {
        try {
            const response = await fetch(`http://localhost:8080/pedidos/${pedidoId}/entregar`, {
                method: "POST",
            });
            if (!response.ok) throw new Error("No se pudo marcar como entregado");
            alert("Pedido marcado como entregado");
            setPedidos(pedidos.map(p => p.orderId === pedidoId ? { ...p, estado: "ENTREGADO" } : p));
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el pedido");
        }
    };


    const handleDescargarPDF = async (pedidoId) => {
        try {
            const response = await fetch(`http://localhost:8080/pedidos/${pedidoId}/pdf`);
            if (!response.ok) throw new Error("Error al generar PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Pedido_${pedidoId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p className="loading-text">Cargando pedidos...</p>;

    return (
        <>
            <Header />
            <div className="pedidos-container">
                <h3 className="pedidos-title">📝 Mis Pedidos</h3>
                {pedidos.length === 0 ? (
                    <p className="no-pedidos-text">No tienes pedidos.</p>
                ) : (
                    <div className="pedidos-list">
                        {pedidos.map((pedido) => (
                            <div className="pedido-card" key={pedido.orderId}>
                                <div className="pedido-header">
                                    <div>
                                        <span className="pedido-id">Codigo de pedido #{pedido.orderId}</span>
                                        <span className="pedido-date">
                                            {pedido.date &&
                                                `${new Date(pedido.date).toLocaleDateString()} ${new Date(
                                                    pedido.date
                                                ).toLocaleTimeString()}`}
                                        </span>
                                    </div>
                                    <span className="pedido-total">Total: S/ {pedido.total}</span>
                                </div>

                                <div className="pedido-details">
                                    {pedido.status === "PENDIENTE" && (
                                        <button className="btn-pdf" onClick={() => handleCancelarPedido(pedido.orderId)}>
                                            Cancelar pedido
                                        </button>
                                    )}

                                    {pedido.status === "EN_PROCESO" && (
                                        <button className="btn-pdf" onClick={() => handleEntregarPedido(pedido.orderId)}>
                                            Marcar como entregado
                                        </button>
                                    )}
                                    <button
                                        className="btn-pdf"
                                        onClick={() => navigate(`/resumen/${pedido.orderId}`)}
                                    >
                                        Ver detalles
                                    </button>
                                    <button
                                        className="btn-pdf"
                                        onClick={() => handleDescargarPDF(pedido.orderId)}
                                    >
                                        Descargar PDF
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </>
    );
}
