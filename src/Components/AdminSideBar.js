import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Estilos/AdminSideBar.css';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nombre: '', apellidos: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.nombre) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <h2>Panel Admin</h2>
      </div>
      {user.nombre && (
        <div className="admin-user">
          Hola, {user.nombre} {user.apellidos}
        </div>
      )}
      <nav className="admin-nav">
        <button onClick={() => navigate('/admin')}>Inicio</button>
        <button onClick={() => navigate('/admin/usuarios')}>Clientes</button>
        <button onClick={() => navigate('/admin/reclamos')}>Reclamos</button>
        <button onClick={() => navigate('/admin/productos')}>Productos</button>
        <button onClick={() => navigate('/admin/ventas')}>Ventas</button>
      </nav>
      <div className="admin-logout">
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}