import React from 'react';
import ProductList from './ProductList';
import UserList from '../UserList';

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