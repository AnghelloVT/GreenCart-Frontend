import React, { useEffect, useState } from 'react';
function ProductList() {
    const [productos, setProductos] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8081/productos/all")
            .then(res => res.json())
            .then(data => setProductos(data));
    }, []);
    return (
        <div>
            <h2>Lista de productos</h2>
            <ul>
                {productos.map(p => (
                    <li key={p.productId}>{p.productName} {p.productDescription} - S/. {p.productPrice}</li>
                ))}
            </ul>
        </div>
    );
}
export default ProductList;