# 📸 Image Upload API — Node + Express + AWS S3

API para subir imágenes a un bucket de AWS S3.

---

## 🚀 Setup rápido

### 1. Instala dependencias
```bash
npm install
```

### 2. Crea tu archivo `.env`
Copia el archivo de ejemplo y llena tus datos de AWS:
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=TU_SECRET_KEY
AWS_REGION=us-east-1
S3_BUCKET_NAME=nombre-de-tu-bucket
PORT=3030
```

### 3. Arranca el servidor
```bash
# Producción
npm start

# Desarrollo (con hot reload)
npm run dev
```

---

## 📡 Endpoints

### `GET /`
Health check — verifica que la API está corriendo.

---

### `POST /api/images/upload`
Sube **una sola imagen**.

- **Content-Type:** `multipart/form-data`
- **Field:** `image`
- **Query param opcional:** `?folder=avatars` (carpeta dentro del bucket)

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3030/api/images/upload \
  -F "image=@/ruta/a/tu/foto.jpg"
```

**Respuesta:**
```json
{
  "success": true,
  "url": "https://tu-bucket.s3.us-east-1.amazonaws.com/images/1234567-abc.jpg",
  "key": "images/1234567-abc.jpg",
  "originalName": "foto.jpg",
  "size": 204800,
  "mimetype": "image/jpeg"
}
```

---

### `POST /api/images/upload-multiple`
Sube **hasta 10 imágenes** a la vez.

- **Content-Type:** `multipart/form-data`
- **Field:** `images` (múltiple)

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3030/api/images/upload-multiple \
  -F "images=@foto1.jpg" \
  -F "images=@foto2.png"
```

**Respuesta:**
```json
{
  "success": true,
  "count": 2,
  "images": [
    { "url": "...", "key": "...", "originalName": "foto1.jpg", "size": 102400 },
    { "url": "...", "key": "...", "originalName": "foto2.png", "size": 204800 }
  ]
}
```

---

### `DELETE /api/images`
Elimina una imagen del bucket.

- **Content-Type:** `application/json`
- **Body:** `{ "key": "images/nombre-del-archivo.jpg" }`

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3030/api/images \
  -H "Content-Type: application/json" \
  -d '{"key": "images/1234567-abc.jpg"}'
```

---

## 📋 Tipos de archivo permitidos
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/gif`

**Tamaño máximo:** 5MB por imagen

---

## 🔐 Permisos necesarios en AWS IAM

Tu usuario de AWS necesita estas políticas sobre el bucket:
```json
{
  "Effect": "Allow",
  "Action": ["s3:PutObject", "s3:DeleteObject"],
  "Resource": "arn:aws:s3:::TU_BUCKET/*"
}
```
