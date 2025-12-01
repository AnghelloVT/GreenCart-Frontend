import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaUsers, FaBoxOpen, FaCommentDots, FaEye, FaFacebookF, FaTwitter } from "react-icons/fa";
import AdminPage from "./AdminPage";

export default function DashboardInicio() {
  const totales = {
    usuarios: 1200,
    productos: 640,
    reclamos: 50
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Sidebar fijo */}
      <AdminPage />

      {/* Contenido principal */}
      <main style={{ marginLeft: 240, padding: 40, width: "100%" }}>
        {/* Título general */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontWeight: "bold", color: "#333" }}>Analytics</h1>
        </div>

        {/* Métricas superiores con colores */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card className="text-center shadow-sm" style={{ borderRadius: "12px", padding: "20px", backgroundColor: "#4e73df", color: "#fff" }}>
              <Card.Body>
                <FaEye size={30} className="mb-2" />
                <Card.Title>VISITS</Card.Title>
                <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>5,000</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center shadow-sm" style={{ borderRadius: "12px", padding: "20px", backgroundColor: "#4267B2", color: "#fff" }}>
              <Card.Body>
                <FaFacebookF size={30} className="mb-2" />
                <Card.Title>FOLLOWERS</Card.Title>
                <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>100k</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center shadow-sm" style={{ borderRadius: "12px", padding: "20px", backgroundColor: "#1DA1F2", color: "#fff" }}>
              <Card.Body>
                <FaTwitter size={30} className="mb-2" /> {/* Aquí el logo antiguo de Twitter; si quieres un SVG nuevo de X se puede reemplazar */}
                <Card.Title>FOLLOWERS</Card.Title>
                <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>50k</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tarjetas de totales */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="text-center shadow-sm" style={{ borderRadius: "12px", padding: "30px", background: "#ffffff" }}>
              <Card.Body>
                <FaUsers size={50} className="mb-3" color="#4e73df" />
                <Card.Title>Total Usuarios</Card.Title>
                <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {totales.usuarios}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="text-center shadow-sm" style={{ borderRadius: "12px", padding: "30px", background: "#ffffff" }}>
              <Card.Body>
                <FaBoxOpen size={50} className="mb-3" color="#1cc88a" />
                <Card.Title>Total Productos</Card.Title>
                <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {totales.productos}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={12}>
            <Card className="text-center shadow-sm" style={{ borderRadius: "12px", padding: "30px", background: "#ffffff" }}>
              <Card.Body>
                <FaCommentDots size={50} className="mb-3" color="#f6c23e" />
                <Card.Title>Total Reclamos</Card.Title>
                <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {totales.reclamos}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
}
