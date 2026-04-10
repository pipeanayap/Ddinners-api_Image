require("dotenv").config();
const express = require("express");
const cors = require("cors");
const imagesRouter = require("./src/routes/images");

const app = express();
const PORT = process.env.PORT || 3030;

// ── Middlewares ──────────────────────────────────────
app.use(cors()); // permite peticiones desde cualquier origen
app.use(express.json());

// ── Rutas ────────────────────────────────────────────
app.use("/api/images", imagesRouter);

// ── Health check ─────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Image Upload API funcionando 🚀",
    endpoints: {
      "POST /api/images/upload": "Sube una imagen (form-data, key: image)",
      "POST /api/images/upload-multiple": "Sube hasta 10 imágenes (form-data, key: images)",
      "DELETE /api/images": "Elimina una imagen (body JSON: { key })",
    },
  });
});

// ── Manejo de errores global ──────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Error interno del servidor",
  });
});

// ── Inicio del servidor ───────────────────────────────
app.listen(PORT, () => {
  console.log(`\nAPI corriendo en http://localhost:${PORT}`);
  console.log(`Bucket: ${process.env.S3_BUCKET_NAME}`);
  console.log(`Región: ${process.env.AWS_REGION}\n`);
});
