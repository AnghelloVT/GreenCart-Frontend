import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import 'bootstrap/dist/css/bootstrap.min.css';


function ProductForm() {
    const [formData, setFormData] = useState({
        productName: '',
        categoryId: '',
        productDescription: '',
        productPrice: '',
        productStock: '',
        active: true
    });

    const categories = [
        { categoryId: 1, category: 'Bolsas', active: true },
        { categoryId: 2, category: 'Zapatos', active: true },
        { categoryId: 3, category: 'Accesorios', active: true }
    ];

     
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

   const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedCategory = categories.find(
            (cat) => cat.categoryId === parseInt(formData.categoryId)
        );

        if (!selectedCategory) {
            alert("Categoría inválida");
            return;
        }

       const productToSend = {
   productName: formData.productName,
    categoryId: parseInt(formData.categoryId),
    productDescription: formData.productDescription,
    productPrice: parseFloat(formData.productPrice),
    productStock: parseInt(formData.productStock),
    active: formData.active,
};

        try {
            const response = await fetch('http://localhost:8081/productos/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToSend)
            });

            if (response.ok) {
                alert('Producto agregado exitosamente');
                setFormData({
                    productName: '',
                    categoryId: '',
                    productDescription: '',
                    productPrice: '',
                    productStock: '',
                    active: true
                });
            } else {
                alert('Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    };


    return (
        <div className="container my-4">
  <div className="card shadow-sm">
    <div className="card-header">
      <h5 className="modal-title">Agregar Nuevo Producto</h5>
    </div>
    <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="productName" className="form-label">
                    Nombre del producto
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="categoryId" className="form-label">
                    Categoría
                  </label>
                  <select
                    className="form-select"
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Selecciona una categoría --</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="productDescription" className="form-label">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="productPrice" className="form-label">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="productPrice"
                    name="productPrice"
                    value={formData.productPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="productStock" className="form-label">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="productStock"
                    name="productStock"
                    value={formData.productStock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 d-flex align-items-center mb-3">
                  <div className="form-check mt-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Activo
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-primary">
                  Agregar producto
                </button>
                <button type="reset" className="btn btn-secondary" onClick={() => setFormData({
                  productName: '',
                  categoryId: '',
                  productDescription: '',
                  productPrice: '',
                  productStock: '',
                  active: true,
                })}>
                  Limpiar
                </button>
              </div>
            </form>
           </div>
  </div>
</div>
    );
}

export default ProductForm;