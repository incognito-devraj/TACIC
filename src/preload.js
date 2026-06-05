const {
  contextBridge,
  ipcRenderer,
} = require("electron");

contextBridge.exposeInMainWorld(
  "electronAPI",
  {
    selectFolder: () =>
      ipcRenderer.invoke("select-folder"),

    scanFolder: (folderPath) =>
      ipcRenderer.invoke(
        "scan-folder",
        folderPath
      ),

    generateExport: (folderPath) =>
      ipcRenderer.invoke(
        "generate-export",
        folderPath
      ),

    saveExport: (text) =>
      ipcRenderer.invoke(
        "save-export",
        text
    ),
  }
);