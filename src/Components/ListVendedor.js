import React, { useState, useEffect } from 'react';
import ProductListVendedor from './ProductListVendedor';

function MisProductosVendedor({ vendedorId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!vendedorId) return;

    fetch(`https://greencart-backend-085d.onrender.com/productos/vendedor/${vendedorId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener productos');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error cargando productos del vendedor:', error);
      });
  }, [vendedorId]);

  

  return (
    <ProductListVendedor
      products={products}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
}

export default MisProductosVendedor;