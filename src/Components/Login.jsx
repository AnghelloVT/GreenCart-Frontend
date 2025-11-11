import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import './Login.css';
import fondo from '../img/fondo.jpg';
import logo from '../img/logo.jpg';

const MySwal = withReactContent(Swal);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!email.trim() || !password) {
            MySwal.fire({
                title: 'Error',
                text: 'Por favor, completa todos los campos',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            return;
        }

        const params = new URLSearchParams({ correo: email, contraseña: password });

        fetch('http://localhost:8080/login', {
            method: 'POST',
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
         body: params.toString(),
         })

            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    // ✅ Guardar solo los datos del usuario
                    const user = {
                        id: data.id,
                        nombre: data.nombre,
                        apellidos: data.apellidos,
                        correo: data.correo,
                        dni: data.dni,
                        direccion: data.direccion,
                        telefono: data.telefono
                    };
                    localStorage.setItem('user', JSON.stringify(user));

                    MySwal.fire({
                        title: '¡Éxito!',
                        text: 'Has iniciado sesión correctamente',
                        icon: 'success',
                        confirmButtonText: 'Continuar',
                    }).then(() => {
                        // ✅ Redirigir según rol recibido
                        const rol = (data.rol || '').toLowerCase();

                        switch (rol) {
                            case 'vendedor':
                                navigate('/vendedor');
                                break;
                            case 'administrador':
                                navigate('/admin');
                                break;
                            default:
                                navigate('/productos');
                                break;
                        }
                    });
                } else {
                    MySwal.fire({
                        title: 'Error',
                        text: 'Correo o contraseña incorrectos',
                        icon: 'error',
                        confirmButtonText: 'Cerrar',
                    });
                }
            })
            .catch(() => {
                MySwal.fire({
                    title: 'Error',
                    text: 'Error al iniciar sesión',
                    icon: 'error',
                    confirmButtonText: 'Cerrar',
                });
            });
    };

    return (
        <div className="login-background" style={{ backgroundImage: `url(${fondo})` }}>
            <div className="login-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo GreenCart" className="logo" />
                </div>
                <div className="header-texts">
                    <h1>¡Bienvenido a GreenCart!</h1>
                    <h2>Ingresa tu correo y contraseña para iniciar sesión</h2>
                </div>
                <form onSubmit={e => e.preventDefault()} noValidate>
                    <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={handleSubmit} className="btn-login">
                        Ingresar
                    </button>
                </form>
                <p>
                    ¿No tienes una cuenta? <a href="/registro" className="link">Regístrate</a>
                </p>
            </div>
        </div>
    );
}