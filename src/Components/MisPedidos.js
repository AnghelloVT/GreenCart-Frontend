import React from "react";
import MisPedidosVendedor from "./MisPedidosVendedor";
import MisPedidosComprador from "./MisPedidosComprador";

export default function MisPedidos() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <p className="no-user-text">Debes iniciar sesión para ver tus pedidos.</p>;

    return user.rol === "vendedor" ? <MisPedidosVendedor /> : <MisPedidosComprador />;
}
