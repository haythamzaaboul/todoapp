// main.js

const path = require("path");
const express = require("express");
const { pathToFileURL } = require("url");

// Auto-reload is disabled because electron-reload fails to initialize with the current Electron version.
// If you need it, install a compatible version and restore this require.

const { app, BrowserWindow } = require("electron");

let apiStarted = false;
async function startApiServer() {
  if (apiStarted) return;
  apiStarted = true;

  const server = express();
  server.use(express.json());
  // Simple CORS for file:// origin in Electron
  server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // Initialize database and routes (ESM imports)
  const routesPath = path.join(__dirname, "public", "frontend", "src", "routes", "index.js");
  const loaderPath = path.join(
    __dirname,
    "public",
    "frontend",
    "src",
    "loaders",
    "loaders.sqlite.js"
  );
  await import(pathToFileURL(loaderPath));
  const routesModule = await import(pathToFileURL(routesPath));
  const routes = routesModule.default || routesModule;
  // Routes already prefix /api inside index.js
  server.use(routes);

  const port = process.env.PORT || 3000;
  server
    .listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    })
    .on("error", (err) => {
      console.error("API server failed to start:", err.message);
    });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "public/app.html"));
}

// Start API immediately so it works even if the Electron window fails
startApiServer().catch((err) => {
  console.error("Failed to start API server:", err);
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
