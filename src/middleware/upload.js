const multer = require("multer");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

const upload = multer({
  storage: multer.memoryStorage(), // se guarda en RAM antes de subir a S3
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido. Solo se aceptan: ${ALLOWED_TYPES.join(", ")}`));
    }
  },
});

module.exports = upload;
