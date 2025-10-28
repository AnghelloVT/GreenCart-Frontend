import React from "react";
import { useCart } from "../Context/CartContext";
import Header from "./Header";

function Cart() {
  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart();

  const totalGeneral = cart.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <>
      <Header />
      <div className="container py-5 flex-grow-1">
        <h1 className="mb-4 text-center text-success">🛒 Carrito de Compras</h1>

        {cart.length === 0 ? (
          <p className="text-center text-muted fs-5">El carrito está vacío.</p>
        ) : (
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">Tu Carrito</div>
            <table className="table align-middle mb-0">
              <thead className="table-success">
                <tr>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Vendedor</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.productDescription}</td>
                    <td>S/. {(item.productPrice || 0).toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => decreaseQuantity(item.productId)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>S/. {(item.total || 0).toFixed(2)}</td>
                    <td>{item.sellerId || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-3 text-end">
              <h5>
                Total General:{" "}
                <span className="text-success">S/. {totalGeneral.toFixed(2)}</span>
              </h5>
              <div className="mt-3">
                <a href="/productos" className="btn btn-secondary me-2">
                  Volver
                </a>
                <button className="btn btn-danger me-2" onClick={clearCart}>
                  Vaciar carrito
                </button>
                <a href="/pago" className="btn btn-success">
                  Comprar
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
