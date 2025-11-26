import React, { useEffect, useState } from "react";
import AdminPage from "./AdminPage";
import Swal from "sweetalert2";
import "../Estilos/AdminProductos.css";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [idBuscar, setIdBuscar] = useState("");
  const [categoriaBuscar, setCategoriaBuscar] = useState("");
  const [vendedorBuscar, setVendedorBuscar] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState({
    productId: "",
    productName: "",
    productDescription: "",
    productPrice: "",
    productStock: "",
    categoryId: "",
    vendedorId: "",
    image: null,
  });

  // Normaliza datos del backend
  const normalizarProducto = (p) => ({
    productId: p.productId,
    productName: p.productName,
    productDescription: p.productDescription,
    productPrice: p.productPrice,
    productStock: p.productStock,
    categoryId: p.categoryId,
    vendedorId: p.vendedorId,
    imageUrl: p.productImage
      ? `http://localhost:8080/uploads/${p.productImage}`
      : null,
  });

  const fetchProductos = async () => {
    setCargando(true);
    try {
      const response = await fetch("http://localhost:8080/productos/all");
      const data = await response.json();
      setProductos(data.map(normalizarProducto));
    } catch {
      Swal.fire("Error", "No se pudieron cargar productos", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const buscarPorId = async () => {
    if (!idBuscar) return;

    setCargando(true);
    try {
      const res = await fetch(`http://localhost:8080/productos/${idBuscar}`);
      const data = await res.json();

      if (!data || data.error) {
        Swal.fire("Error", "Producto no encontrado", "error");
        return;
      }

      setProductos([normalizarProducto(data)]);
    } catch {
      Swal.fire("Error", "No se pudo buscar producto", "error");
    } finally {
      setCargando(false);
    }
  };

  const buscarPorCategoria = async () => {
    if (!categoriaBuscar) return;

    setCargando(true);
    try {
      const res = await fetch(
        `http://localhost:8080/productos/category/${categoriaBuscar}`
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        Swal.fire("Error", "No hay productos en esta categoría", "error");
        return;
      }

      setProductos(data.map(normalizarProducto));
    } catch {
      Swal.fire("Error", "Error al buscar por categoría", "error");
    } finally {
      setCargando(false);
    }
  };

  const buscarPorVendedor = async () => {
    if (!vendedorBuscar) return;

    setCargando(true);
    try {
      const res = await fetch(
        `http://localhost:8080/productos/vendedor/${vendedorBuscar}`
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        Swal.fire("Error", "No hay productos de este vendedor", "error");
        return;
      }

      setProductos(data.map(normalizarProducto));
    } catch {
      Swal.fire("Error", "Error al buscar vendedor", "error");
    } finally {
      setCargando(false);
    }
  };

  const reset = () => {
    setIdBuscar("");
    setCategoriaBuscar("");
    setVendedorBuscar("");
    fetchProductos();
  };

  const eliminarProducto = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción es permanente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:8080/productos/delete/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
        fetchProductos();
      } else {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    } catch {
      Swal.fire("Error", "Error al eliminar", "error");
    }
  };

  const abrirEditar = (p) => {
    setEditProduct({
      productId: p.productId,
      productName: p.productName,
      productDescription: p.productDescription,
      productPrice: p.productPrice,
      productStock: p.productStock,
      categoryId: p.categoryId,
      vendedorId: p.vendedorId,
      image: null,
    });

    setEditModal(true);
  };

  const guardarCambios = async () => {
    const formData = new FormData();

    formData.append("productId", editProduct.productId);
    formData.append("productName", editProduct.productName);
    formData.append("productDescription", editProduct.productDescription);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("productStock", editProduct.productStock);
    formData.append("categoryId", editProduct.categoryId);
    formData.append("vendedorId", editProduct.vendedorId);

    if (editProduct.image instanceof File) {
      formData.append("file", editProduct.image);
    }

    try {
      const res = await fetch(
        `http://localhost:8080/productos/update/${editProduct.productId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
        setEditModal(false);
        fetchProductos();
      } else {
        Swal.fire("Error", "No se pudo actualizar", "error");
      }
    } catch {
      Swal.fire("Error", "Error al editar producto", "error");
    }
  };

  return (
    <div>
      <AdminPage />

      <main style={{ marginLeft: 240, padding: 40 }}>
        <h1>Productos</h1>

        
        <div className="filtros-usuarios">
          <input
            type="number"
            placeholder="Buscar por ID"
            value={idBuscar}
            onChange={(e) => setIdBuscar(e.target.value)}
          />
          <button className="btn-buscar" onClick={buscarPorId}>
            Buscar ID
          </button>

          <input
            type="number"
            placeholder="Buscar por categoría"
            value={categoriaBuscar}
            onChange={(e) => setCategoriaBuscar(e.target.value)}
          />
          <button className="btn-buscar" onClick={buscarPorCategoria}>
            Categoría
          </button>

          <input
            type="number"
            placeholder="Buscar por vendedor"
            value={vendedorBuscar}
            onChange={(e) => setVendedorBuscar(e.target.value)}
          />
          <button className="btn-buscar" onClick={buscarPorVendedor}>
            Vendedor
          </button>

          <button className="btn-listar" onClick={reset}>
            Listar
          </button>
        </div>

        
        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Vendedor</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((p) => (
                <tr key={p.productId}>
                  <td>{p.productId}</td>
                  <td>{p.productName}</td>
                  <td>S/. {p.productPrice}</td>
                  <td>{p.productStock}</td>
                  <td>{p.categoryId}</td>
                  <td>{p.vendedorId}</td>
                  <td>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt=""
                        width="60"
                        style={{ borderRadius: 6 }}
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => abrirEditar(p)}>
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => eliminarProducto(p.productId)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        
        {editModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Editar Producto</h2>

              <label>Nombre</label>
              <input
                type="text"
                value={editProduct.productName}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, productName: e.target.value })
                }
              />

              <label>Descripción</label>
              <textarea
                value={editProduct.productDescription}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    productDescription: e.target.value,
                  })
                }
              ></textarea>

              <label>Precio</label>
              <input
                type="number"
                value={editProduct.productPrice}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, productPrice: e.target.value })
                }
              />

              <label>Stock</label>
              <input
                type="number"
                value={editProduct.productStock}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, productStock: e.target.value })
                }
              />

              <label>Categoría</label>
              <input
                type="number"
                value={editProduct.categoryId}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, categoryId: e.target.value })
                }
              />

              <label>Vendedor</label>
              <input
                type="number"
                value={editProduct.vendedorId}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, vendedorId: e.target.value })
                }
              />

              <label>Nueva Imagen (opcional)</label>
              <input
                type="file"
                onChange={(e) =>
                  setEditProduct({ ...editProduct, image: e.target.files[0] })
                }
              />

              <button className="btn-save" onClick={guardarCambios}>
                Guardar
              </button>

              <button className="btn-cancel" onClick={() => setEditModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
