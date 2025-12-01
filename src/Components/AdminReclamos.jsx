import React, { useEffect, useState } from "react";
import AdminPage from "./AdminPage";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function AdminReclamos() {
  const [reclamos, setReclamos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [reclamoActivo, setReclamoActivo] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const estadosPermitidos = ["EN_PROCESO", "RESUELTO"];

  useEffect(() => {
    fetch("https://greencart-backend-085d.onrender.com/reclamos/all")
      .then(res => res.json())
      .then(data => setReclamos(data))
      .catch(err => console.error("Error al cargar reclamos:", err));
  }, []);

  const abrirModal = (reclamo) => {
    setReclamoActivo(reclamo);
    setNuevoEstado(reclamo.claimstatus);
    setOpenModal(true);
  };

  const guardarCambios = () => {
    fetch(`https://greencart-backend-085d.onrender.com/reclamos/update/${reclamoActivo.idcomplaints}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimstatus: nuevoEstado }),
    })
      .then(res => res.json())
      .then(updated => {
        setReclamos(reclamos.map(r =>
          r.idcomplaints === updated.idcomplaints ? updated : r
        ));
        setOpenModal(false);
      });
  };

  return (
    <div>
      {/* Barra lateral fija */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "240px",
        zIndex: 1000
      }}>
        <AdminPage />
      </div>

      {/* Contenido principal con margen */}
      <main style={{ marginLeft: 240, padding: "40px" }}>
        <Typography variant="h4" sx={{ color: "green", mb: 3 }}>
          Reclamos de Usuarios
        </Typography>

        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "black" }}>
                <TableCell sx={{ color: "white" }}>ID Reclamo</TableCell>
                <TableCell sx={{ color: "white" }}>ID Usuario</TableCell>
                <TableCell sx={{ color: "white" }}>Asunto</TableCell>
                <TableCell sx={{ color: "white" }}>Mensaje</TableCell>
                <TableCell sx={{ color: "white" }}>Estado</TableCell>
                <TableCell sx={{ color: "white" }}>Editar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reclamos.map(r => (
                <TableRow key={r.idcomplaints}>
                  <TableCell sx={{ color: "black" }}>{r.idcomplaints}</TableCell>
                  <TableCell sx={{ color: "black" }}>{r.userId}</TableCell>
                  <TableCell sx={{ color: "black" }}>{r.claimreason}</TableCell>
                  <TableCell sx={{ color: "black" }}>{r.detail}</TableCell>
                  <TableCell sx={{ color: "black" }}>{r.claimstatus}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      sx={{ backgroundColor: "green", "&:hover": { backgroundColor: "#006400" } }}
                      onClick={() => abrirModal(r)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal */}
        {reclamoActivo && (
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Editar Reclamo #{reclamoActivo.idcomplaints}</DialogTitle>
            <DialogContent>
              <Typography sx={{ mt: 1 }}>
                <strong>Asunto:</strong> {reclamoActivo.claimreason}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Mensaje:</strong> {reclamoActivo.detail}
              </Typography>

              <Typography sx={{ mt: 2, mb: 1 }}><strong>Estado:</strong></Typography>
              <Select
                fullWidth
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
              >
                {estadosPermitidos.map(estado => (
                  <MenuItem key={estado} value={estado}>
                    {estado}
                  </MenuItem>
                ))}
              </Select>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
              <Button variant="contained" sx={{ backgroundColor: "green", "&:hover": { backgroundColor: "#006400" } }} onClick={guardarCambios}>
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </main>
    </div>
  );
}
