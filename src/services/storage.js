const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const path = require("path");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const toWebP = async (file) => {
  // GIF se deja sin convertir
  if (file.mimetype === "image/gif") {
    return { buffer: file.buffer, contentType: "image/gif" };
  }

  const buffer = await sharp(file.buffer)
    .webp({ quality: 82 })
    .toBuffer();

  return { buffer, contentType: "image/webp" };
};


const uploadToS3 = async (file, folder = "images") => {
  const { buffer, contentType } = await toWebP(file);

  // Nombre del archivo siempre con extensión .webp (o .gif si es gif)
  const ext = contentType === "image/gif" ? ".gif" : ".webp";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const key = `${folder}/${filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { url, key };
};


const deleteFromS3 = async (key) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    })
  );
};

module.exports = { uploadToS3, deleteFromS3 };
