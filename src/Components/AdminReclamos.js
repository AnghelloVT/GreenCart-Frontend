import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSideBar';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../Estilos/AdminReclamos.css';

const MySwal = withReactContent(Swal);

export default function AdminReclamos() {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/reclamos/all')
      .then(res => res.json())
      .then(data => {
        setReclamos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar reclamos:', err);
        setLoading(false);
      });
  }, []);

  const abrirModal = reclamo => {
    MySwal.fire({
      title: `Reclamo #${reclamo.idcomplaints}`,
      html: `
        <div style="text-align: left; margin-top: 10px;">
          <p><strong>Usuario ID:</strong> ${reclamo.userId}</p>
          <p><strong>Asunto:</strong> ${reclamo.claimreason}</p>
          <p><strong>Mensaje:</strong> ${reclamo.detail}</p>
          <p><strong>Estado:</strong>
            <select id="estadoSelect" style="width: 100%; padding: 8px; margin-top: 5px; border-radius: 5px; border: 1px solid #ccc;">
              ${reclamo.claimstatus !== 'EN_PROCESO' ? `<option value="EN_PROCESO" ${reclamo.claimstatus === 'EN_PROCESO' ? 'selected' : ''}>EN_PROCESO</option>` : ''}
              ${reclamo.claimstatus !== 'RESUELTO' ? `<option value="RESUELTO" ${reclamo.claimstatus === 'RESUELTO' ? 'selected' : ''}>RESUELTO</option>` : ''}
              ${reclamo.claimstatus !== 'CANCELADO' ? `<option value="CANCELADO" ${reclamo.claimstatus === 'CANCELADO' ? 'selected' : ''}>CANCELADO</option>` : ''}
            </select>
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      width: '600px', // hace el modal más ancho
      padding: '30px',
      customClass: {
        popup: 'swal-modal-custom',
      },
      preConfirm: () => {
        const nuevoEstado = document.getElementById('estadoSelect').value;
        return { nuevoEstado };
      }
    }).then(result => {
      if (result.isConfirmed) {
        const { nuevoEstado } = result.value;
        fetch(`/reclamos/update/${reclamo.idcomplaints}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ claimstatus: nuevoEstado }),
        })
          .then(res => res.json())
          .then(updated => {
            setReclamos(reclamos.map(r => r.idcomplaints === updated.idcomplaints ? updated : r));
            MySwal.fire('Actualizado', 'El estado del reclamo ha sido actualizado', 'success');
          })
          .catch(err => {
            console.error('Error al actualizar estado:', err);
            MySwal.fire('Error', 'No se pudo actualizar el estado', 'error');
          });
      }
    });
  };

  if (loading) {
    return <div style={{ padding: '40px' }}>Cargando reclamos...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '40px' }}>
        <h1>Reclamos de Usuarios</h1>
        {reclamos.length === 0 ? (
          <p>No hay reclamos registrados.</p>
        ) : (
          <table className="reclamos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reclamos.map(r => (
                <tr key={r.idcomplaints}>
                  <td>{r.idcomplaints}</td>
                  <td>{r.userId}</td>
                  <td>{r.claimreason}</td>
                  <td>{r.detail}</td>
                  <td>{r.claimstatus}</td>
                  <td>
                    <button className="btn-acciones" onClick={() => abrirModal(r)}>Acciones</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}