import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



function ProductListVendedor({ products, onDelete, onEdit }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [categories, setCategories] = useState([]);
  const [editFile, setEditFile] = useState(null);

  useEffect(() => {
    fetch('https://greencart-backend-085d.onrender.com/categorias')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error cargando categorías:', err));
  }, []);

  const startEdit = (product) => {
    setEditId(product.productId);
    setEditData({
      productId: product.productId,
      productName: product.productName,
      categoryId: product.categoryId,
      productDescription: product.productDescription,
      productPrice: product.productPrice,
      productStock: product.productStock,
      active: product.active,
      vendedorId: JSON.parse(localStorage.getItem("user"))?.id,
    });
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
    setEditFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const saveEdit = () => {
    const formData = new FormData();
    formData.append("productId", editData.productId);
    formData.append("productName", editData.productName);
    formData.append("categoryId", editData.categoryId);
    formData.append("productDescription", editData.productDescription);
    formData.append("productPrice", editData.productPrice);
    formData.append("productStock", editData.productStock);
    formData.append("active", editData.active);
    formData.append("vendedorId", JSON.parse(localStorage.getItem('user'))?.id);

    if (editFile) {
      formData.append("file", editFile);
    }

    onEdit(editData.productId, formData);
    setEditId(null);
  };

  const handleFileChange = (e) => {
    setEditFile(e.target.files[0]);
  };

  return (
    <div className="container my-5">
      <h2 className="text-success fw-bold mb-4 text-center">
        🌱 Mis Productos Ecológicos
      </h2>
      <div className="row">
        {products.length === 0 && <p className="text-center">No tienes productos aún.</p>}
        {products.map((p) => (
          <div key={p.productId} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm border-0">

              <img src={`/uploads/${p.productImage}`} className="card-img-top" alt={p.productName} />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-dark">{p.productName}</h5>
                <p className="card-text text-muted flex-grow-1">{p.productDescription}</p>
                <p className="text-success mb-1">
                  <strong>Categoría:</strong> {p.productCategory?.category || p.categoryId}
                </p>
                <h6 className="text-primary mb-3">S/. {p.productPrice.toFixed(2)}</h6>
                <div className="d-flex gap-2 mt-auto">
                  <button
                    className="btn btn-warning btn-sm flex-grow-1"
                    onClick={() => startEdit(p)}
                    data-bs-toggle="modal"
                    data-bs-target="#editProductModal"
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm flex-grow-1"
                    onClick={() => onDelete(p.productId)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div
        className="modal fade"
        id="editProductModal"
        tabIndex="-1"
        aria-labelledby="editProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editProductModalLabel">
                Editar Producto
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" onClick={cancelEdit}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="productName"
                  value={editData.productName || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Categoría:</label>
                <select
                  name="categoryId"
                  value={editData.categoryId || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- Seleccione categoría --</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label>Descripción:</label>
                <textarea
                  name="productDescription"
                  value={editData.productDescription || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Precio:</label>
                <input
                  type="number"
                  step="0.01"
                  name="productPrice"
                  value={editData.productPrice || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label>Stock:</label>
                <input
                  type="number"
                  name="productStock"
                  value={editData.productStock || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label>Imagen (opcional):</label>
                <input type="file" onChange={handleFileChange} className="form-control" />
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={editData.active || false}
                  onChange={handleChange}
                  className="form-check-input"
                  id="activeCheckModal"
                />
                <label className="form-check-label" htmlFor="activeCheckModal">
                  Activo
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelEdit}>
                Cancelar
              </button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={saveEdit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductListVendedor;