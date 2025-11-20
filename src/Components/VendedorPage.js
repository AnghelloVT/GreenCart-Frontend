import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ProductListVendedor from './ProductListVendedor';
import Swal from 'sweetalert2';
import HeaderVendedor from "./HeaderVendedor";

function VendedorPage() {
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [products, setProducts] = useState([]);



  const loadProducts = () => {
  const vendedorId = JSON.parse(localStorage.getItem('user'))?.id;
  if (!vendedorId) {
    console.error('No hay vendedorId definido');
    return;
  }

    fetch(`http://localhost:8080/productos/vendedor/${vendedorId}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error('Error cargando productos del vendedor:', err);
      });
  };

  useEffect(() => {
    if (showList) loadProducts();
  }, [showList]);

  const handleDelete = (productId) => {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/productos/delete/${productId}`, {
          method: 'DELETE',
        })
          .then((res) => {
            if (res.ok) {
              Swal.fire('Eliminado!', 'Producto eliminado correctamente.', 'success');
              loadProducts();
            } else {
              Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
            }
          })
          .catch(() => {
            Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
          });
      }
    });
  };

  const handleEdit = (productId, formData) => {
  fetch(`http://localhost:8080/productos/update/${productId}`, {
    method: 'PUT',
    body: formData, 
   
  })
    .then((res) => {
      if (res.ok) {
        Swal.fire('¡Producto actualizado!', '', 'success');
        loadProducts();
      } else {
        Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
      }
    })
    .catch(() => {
      Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
    });
};


  return (
    <><HeaderVendedor/>
    <div className="container my-5">
      <div className="d-flex justify-content-center gap-2 mb-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setShowList(false);
          }}
        >
          Nuevo Producto
        </button>
        <button
          className="btn btn-success"
          onClick={() => {
            setShowList(true);
            setShowForm(false);
          }}
        >
          Mis productos
        </button>
      </div>

      {showForm && <ProductForm onProductAdded={loadProducts} />}
      {showList && (
        <ProductListVendedor
          products={products}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
    </>
  );
}

export default VendedorPage;
