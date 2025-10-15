import React from 'react';
import ProductList from '../components/ProductList';
import UserList from '../components/UserList';

function AdminPage() {
    return (
        <div>
            <h2>Panel de Administrador</h2>
            <ProductList />
            <UserList />
        </div>
    );
}

export default AdminPage;