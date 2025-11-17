import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./MisPedidos.css";

export default function MisPedidosVendedor() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        const endpoint = `http://localhost:8080/pedidos/vendedor/pedidos/${user.id}`;

        fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setPedidos(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [user]);

    const handleDescargarPDF = async (pedidoId) => {
        try {
            const response = await fetch(`http://localhost:8080/pedidos/${pedidoId}/pdf`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Pedido_${pedidoId}.pdf`;
            a.click();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    if (loading) return <p className="loading-text">Cargando pedidos...</p>;

    return (
        <>
            <Header />

            <div className="pedidos-container">
                <h3 className="pedidos-title">📝 Mis pedidos como vendedor</h3>

                {pedidos.length === 0 ? (
                    <p className="no-pedidos-text">No tienes pedidos registrados.</p>
                ) : (
                    <div className="pedidos-list">
                        {pedidos.map((pedido) => {
                            const itemsVendedor = pedido.items.filter(
                                (item) => item.sellerId === Number(user.id)
                            );

                            // Total solo de este vendedor
                            const totalVendedor = itemsVendedor.reduce(
                                (sum, item) => sum + item.unitPrice * item.quantity,
                                0
                            );

                            return (
                                <div
                                    key={pedido.orderId}
                                    className="pedido-card"
                                >
                                    <div
                                        className="pedido-header"
                                        onClick={() => toggleExpand(pedido.orderId)}
                                    >
                                        <div>
                                            <span className="pedido-id">Boleta N°: {pedido.orderId}</span>
                                            <span className="pedido-date">
                                                {new Date(pedido.date).toLocaleDateString()} -
                                                {new Date(pedido.date).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <span className="pedido-total">
                                            S/ {totalVendedor.toFixed(2)}
                                        </span>
                                    </div>

                                    {expandedOrderId === pedido.orderId && (
                                        <div className="pedido-details">
                                            {itemsVendedor.map((item) => (
                                                <div key={item.itemId} className="pedido-item">
                                                    <p><strong>ID Producto:</strong> {item.productId}</p>
                                                    <p><strong>Producto:</strong> {item.productName}</p>
                                                    <p><strong>Cantidad:</strong> {item.quantity}</p>
                                                    <p><strong>Precio:</strong> S/ {item.unitPrice}</p>
                                                </div>
                                            ))}

                                            <button
                                                className="btn-pdf"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDescargarPDF(pedido.orderId);
                                                }}
                                            >
                                                Descargar PDF
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
