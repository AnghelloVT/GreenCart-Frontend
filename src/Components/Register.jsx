import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import '../Estilos/Register.css';
import fondo from '../img/fondo.jpg';
import logo from '../img/logo.jpg';

const MySwal = withReactContent(Swal);

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    dni: '',
    direccion: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!form.apellidos.trim()) newErrors.apellidos = 'Apellidos son requeridos';
    if (!form.email.trim()) newErrors.email = 'Correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Correo inválido';
    if (!/^\d{8}$/.test(form.dni)) newErrors.dni = 'DNI debe tener 8 dígitos';
    if (!form.direccion.trim()) newErrors.direccion = 'Dirección es requerida';
    if (!/^\d{9}$/.test(form.telefono)) newErrors.telefono = 'Teléfono debe tener 9 dígitos';
    if (!form.role.trim()) newErrors.role = 'Debe seleccionar un rol';
    if (form.password.length < 6) newErrors.password = 'Contraseña mínimo 6 caracteres';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const cliente = {
      nombre_cli: form.nombre,
      apellidos_cli: form.apellidos,
      correo: form.email,
      dni: form.dni,
      direccion: form.direccion,
      telefono: form.telefono,
      contraseña: form.password,
      rol: form.role,
    };

    fetch('/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(cliente),
    })
      .then(res => res.text())
      .then(data => {
        if (data === 'ok') {
          MySwal.fire({
            title: 'Registro exitoso',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            window.location.href = '/login';
          });
        } else if (data === 'correo_exist') {
          MySwal.fire({
            title: 'Error',
            text: 'El correo ya está registrado.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
        } else {
          MySwal.fire({
            title: 'Error',
            text: 'Error al registrar. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
        }
      })
      .catch(error =>
        MySwal.fire({
          title: 'Error',
          text: 'Error: ' + error.message,
          icon: 'error',
          confirmButtonText: 'Cerrar',
        })
      );
  };

  return (
    <div className="register-background" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="register-container">
        <div className="logo-container">
          <img src={logo} alt="Logo GreenCart" className="logo" />
        </div>
        <h1>Regístrate </h1>
        <form onSubmit={e => e.preventDefault()} noValidate>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
          {errors.nombre && <small className="error">{errors.nombre}</small>}

          <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
          {errors.apellidos && <small className="error">{errors.apellidos}</small>}

          <input type="email" name="email" placeholder="Correo Electrónico" value={form.email} onChange={handleChange} />
          {errors.email && <small className="error">{errors.email}</small>}

          <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} />
          {errors.dni && <small className="error">{errors.dni}</small>}

          <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
          {errors.direccion && <small className="error">{errors.direccion}</small>}

          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
          {errors.telefono && <small className="error">{errors.telefono}</small>}

          <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
          {errors.password && <small className="error">{errors.password}</small>}

          <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" value={form.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}

          <div>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="" disabled hidden>Seleccione un rol</option>
              <option value="2">Comprador</option>
              <option value="1">Vendedor</option>
            </select>
            {errors.role && <small className="error">{errors.role}</small>}
          </div>

          <button type="button" onClick={handleSubmit} className="btn-register">Regístrate</button>
        </form>
        <p>¿Ya tienes una cuenta? <a href="/login" className="link">Iniciar Sesión</a></p>
      </div>
    </div>
  );
}