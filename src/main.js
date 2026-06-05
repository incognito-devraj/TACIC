const { generateExport } = require("./exporter/exportGenerator");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { scanDirectory } = require("./scanner/directoryScanner");

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(createWindow);

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (result.canceled) return null;

  return result.filePaths[0];
});

ipcMain.handle("scan-folder", async (_, folderPath) => {
  return scanDirectory(folderPath);
});


ipcMain.handle(
  "generate-export",
  async (_, folderPath) => {
    const scanResult = scanDirectory(folderPath);

    return generateExport(
      scanResult,
      folderPath
    );
  }
);

ipcMain.handle(
  "save-export",
  async (_, exportText) => {

    const result =
      await dialog.showSaveDialog({
        defaultPath: "codebase-export.txt",
      });

    if (result.canceled) {
      return false;
    }

    fs.writeFileSync(
      result.filePath,
      exportText
    );

    return true;
  }
);