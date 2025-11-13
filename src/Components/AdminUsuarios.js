import React from 'react';
import AdminSidebar from './AdminSideBar';

export default function AdminUsuarios() {
return (
<div style={{ display: 'flex' }}>
<AdminSidebar />
<main style={{ flex: 1, padding: 24 }}>
<h1>Usuarios</h1>
<p>Listado de usuarios aqui</p>
</main>
</div>
);
}