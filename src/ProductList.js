import React, { useEffect, useState } from 'react';
function ProductList() {
    const [productos, setProductos] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/productos/all")
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch((error) => console.error("Error al cargar productos:", error));
    }, []);
    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 text-success">🛒 Lista de Productos</h2>

            <div className="row">
                {productos.map((p) => (
                    <div key={p.productId} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card h-100 shadow-sm border-0">
                            <img
                                src={`/images/${p.productName.toLowerCase()}.jpg`}
                                className="card-img-top"
                                alt={p.productName}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title text-dark">{p.productName}</h5>
                                <p className="card-text text-muted flex-grow-1">{p.productDescription}</p>
                                <p className="text-success mb-1">
                                    <strong>Categoría:</strong> {p.productCategory?.category}
                                </p>
                                <h6 className="text-primary mb-3">S/. {p.productPrice.toFixed(2)}</h6>
                                <button className="btn btn-success mt-auto">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ProductList;