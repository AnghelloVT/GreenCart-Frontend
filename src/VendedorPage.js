import React from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList'; // solo si ya lo tienes implementado

function VendedorPage() {
    return (
        <div className="container mt-4">
            <h1 className="mb-3 ">Tienda UTP</h1>
            <h2 className="mb-4 text-center">Panel de Vendedor</h2>
            <ProductForm />
        </div>
    );
}

export default VendedorPage;