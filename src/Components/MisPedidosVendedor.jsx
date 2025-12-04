import React, { useEffect, useState } from "react";
import Header from "./HeaderVendedor";
import '../Estilos/MisPedidos.css';

export default function MisPedidosVendedor() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔄 FUNCION PARA RECARGAR PEDIDOS
    const recargarPedidos = async () => {
        try {
            const token = localStorage.getItem("token");
            const endpoint = `https://greencart-backend-085d.onrender.com/pedidos/seller/${user.id}`;

            const res = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            setPedidos(data);
        } catch (err) {
            console.error("Error recargando pedidos:", err);
        }
    };

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        recargarPedidos().finally(() => setLoading(false));
    }, [user]);

    const handleDescargarExcel = async () => {
        try {
            const response = await fetch(`https://greencart-backend-085d.onrender.com/pedidoitems/seller/${user.id}/excel`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) throw new Error("Error al generar Excel");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Productos_Vendedor_${user.id}.xlsx`;
            a.click();
            a.remove();
        } catch (error) {
            console.error(error);
            alert("No se pudo descargar el Excel");
        }
    };

    //Actualizar estado de un item y recargar
    const handleUpdateStatus = async (itemId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://greencart-backend-085d.onrender.com/pedidoitems/${itemId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error("Error al actualizar el estado");

            //DESPUÉS DE ACTUALIZAR, RECARGAR DESDE BACKEND
            await recargarPedidos();

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

                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <button className="btn-pdf" onClick={handleDescargarExcel}>
                        Descargar Excel de todos los productos
                    </button>
                </div>

                {pedidos.length === 0 ? (
                    <p className="no-pedidos-text">No tienes pedidos registrados.</p>
                ) : (
                    <div className="pedidos-list">
                        {pedidos.map((pedido) => {
                            const itemsVendedor = pedido.items.filter(
                                (item) => item.sellerId === Number(user.id)
                            );

                            const totalVendedor = itemsVendedor.reduce(
                                (sum, item) => sum + item.unitPrice * item.quantity,
                                0
                            );

                            return (
                                <div key={pedido.orderId} className="pedido-card">
                                    <div
                                        className="pedido-header"
                                        onClick={() => toggleExpand(pedido.orderId)}
                                    >
                                        <div>
                                            <span className="pedido-id">Boleta N°: {pedido.orderId}</span>
                                            <span className="pedido-date">
                                                {new Date(pedido.date).toLocaleDateString()} -{" "}
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
                                                    <p><strong>Estado:</strong> {item.status}</p>

                                                    {item.status === "PENDIENTE" && (
                                                        <button
                                                            className="btn-pdf"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUpdateStatus(item.itemId, "EN_PROCESO");
                                                            }}
                                                        >
                                                            Marcar como EN_PROCESO
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
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
