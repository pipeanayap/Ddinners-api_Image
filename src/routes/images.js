const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadToS3, deleteFromS3 } = require("../services/storage");

// ─────────────────────────────────────
//  POST /api/images/upload
//  Sube una sola imagen
//  Form-data key: "image"
// ─────────────────────────────────────
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No se recibió ninguna imagen." });
    }

    // Puedes pasar una carpeta personalizada por query param: ?folder=avatars
    const folder = req.query.folder || "images";
    const result = await uploadToS3(req.file, folder);

    return res.status(201).json({
      success: true,
      url: result.url,
      key: result.key,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err) {
    console.error("Error al subir imagen:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────
//  POST /api/images/upload-multiple
//  Sube hasta 10 imágenes a la vez
//  Form-data key: "images"
// ─────────────────────────────────────
router.post("/upload-multiple", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: "No se recibieron imágenes." });
    }

    const folder = req.query.folder || "images";
    const uploads = await Promise.all(req.files.map((file) => uploadToS3(file, folder)));

    const results = uploads.map((upload, i) => ({
      url: upload.url,
      key: upload.key,
      originalName: req.files[i].originalname,
      size: req.files[i].size,
    }));

    return res.status(201).json({
      success: true,
      count: results.length,
      images: results,
    });
  } catch (err) {
    console.error("Error al subir imágenes:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────
//  DELETE /api/images
//  Elimina una imagen del bucket
//  Body JSON: { "key": "images/foto.jpg" }
// ─────────────────────────────────────
router.delete("/", async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ success: false, error: "Se requiere el campo 'key'." });
    }

    await deleteFromS3(key);
    return res.json({ success: true, message: `Imagen '${key}' eliminada correctamente.` });
  } catch (err) {
    console.error("Error al eliminar imagen:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
