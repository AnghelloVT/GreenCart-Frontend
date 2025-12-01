import React, { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import Header from "./Header";
import Footer from "./Footer";
import "../Estilos/ProductList.css";

function ProductList() {
  const [productos, setProductos] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("https://greencart-backend-085d.onrender.com/productos/all")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  const handleAddToCart = (p) => {
    const productoCarrito = {
      productId: p.productId,
      productName: p.productName,
      productDescription: p.productDescription,
      productPrice: p.productPrice,
      productImage: p.productImage, 
      sellerId: p.vendedorId, 
      quantity: 1,
      total: p.productPrice,
    };

    addToCart(productoCarrito);
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <h2 className="text-success fw-bold mb-4 text-center">
          🌱 Productos Ecológicos Disponibles
        </h2>
        <div className="row">
          {productos.map((p) => (
            <div
              key={p.productId}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={p.productImage} // Usa directamente la URL completa
                  className="card-img-top product-image"
                  alt={p.productName}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-dark">{p.productName}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {p.productDescription}
                  </p>
                  <h6 className="text-primary mb-3">
                    S/. {p.productPrice.toFixed(2)}
                  </h6>
                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => handleAddToCart(p)}
                  >
                    Agregar al carrito
                  </button>
                  <p className="mt-2 text-muted">
                    <small>ID Vendedor: {p.vendedorId}</small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductList;
