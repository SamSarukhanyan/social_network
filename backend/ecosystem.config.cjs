module.exports = {
  apps: [
    {
      name: "social-backend",
      script: "src/index.js",
      interpreter: "node",
      node_args: "--loader ./src/esm-alias-loader.js",
      env: {
        NODE_ENV: "production",
        APP_PORT: 4004,
        DB_NAME: "social_network",
        DB_USER: "root",
        DB_PASS: "72121212SamoJan..",
        DB_HOST: "localhost",
        JWT_SECRET: "sdfgf234324gfdgfdgddgfdfdgfdgfd",
        FRONTEND_URL: "http://100.31.143.240",
      },
    },
  ],
};
