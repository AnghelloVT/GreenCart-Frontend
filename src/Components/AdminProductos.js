import React from 'react';
import AdminSidebar from './AdminSideBar';


export default function AdminProductos() {
return (
<div style={{ display: 'flex' }}>
<AdminSidebar />
<main style={{ flex: 1, padding: 24 }}>
<h1>Productos</h1>
<p>Listado de productos aqui</p>
</main>
</div>
);
}