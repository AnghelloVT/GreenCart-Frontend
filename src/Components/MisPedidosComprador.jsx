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
                            <div className="pedido-row" key={pedido.orderId}>
                                <div className="pedido-info">
                                    <span className="pedido-id">Codigo de pedido #{pedido.orderId}</span>
                                    <span className="pedido-total">
                                        Total: S/ {pedido.total} |{" "}
                                        {pedido.date && (
                                            <>
                                                {new Date(pedido.date).toLocaleDateString()}{" "}
                                                {new Date(pedido.date).toLocaleTimeString()}
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="pedido-buttons">
                                    <button
                                        className="pedido-btn btn-ver"
                                        onClick={() => navigate(`/resumen/${pedido.orderId}`)}
                                    >
                                        Ver detalles
                                    </button>
                                    <button
                                        className="pedido-btn btn-pdf"
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
