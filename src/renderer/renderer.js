let selectedFolder = null;

const selectBtn =
  document.getElementById("selectBtn");

const generateBtn =
  document.getElementById("generateBtn");

const copyBtn =
  document.getElementById("copyBtn");

const folderPath =
  document.getElementById("folderPath");

const output =
  document.getElementById("output");

const saveBtn =
  document.getElementById("saveBtn");

selectBtn.addEventListener(
  "click",
  async () => {
    selectedFolder =
      await window.electronAPI.selectFolder();

    if (!selectedFolder) return;

    folderPath.textContent =
      selectedFolder;
  }
);

generateBtn.addEventListener(
  "click",
  async () => {
    if (!selectedFolder) {
      alert("Select folder first");
      return;
    }

    output.value =
      "Generating export...";

    const exportText =
      await window.electronAPI.generateExport(
        selectedFolder
      );

    output.value = exportText;
  }
);

copyBtn.addEventListener(
  "click",
  async () => {
    await navigator.clipboard.writeText(
      output.value
    );

    alert("Copied!");
  }
);

saveBtn.addEventListener(
  "click",
  async () => {

    if (!output.value) {
      alert("Generate export first");
      return;
    }

    const saved =
      await window.electronAPI.saveExport(
        output.value
      );

    if (saved) {
      alert("Saved!");
    }
  }
);