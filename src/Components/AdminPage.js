import React from 'react';
import ProductList from './ProductList';
import UserList from '../UserList';
import AdminSidebar from './AdminSideBar';

function AdminPage() {
    return (
        <div style={{ display: 'flex' }}>
            <AdminSidebar/>
            <div style={{ flex: 1, padding: '40px' }}>
                <h1>Panel de Administración</h1>
            </div>
        </div>
    );
}

export default AdminPage;