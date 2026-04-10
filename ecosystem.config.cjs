module.exports = {
  apps: [
    {
      name: "ddinners-images",
      script: "index.js",
      env: {
        TZ: "America/Mexico_City",
        NODE_ENV: "production",
        PORT: 3030,
        BODY_SIZE_LIMIT: "10485760"
      }
    }
  ]
};
