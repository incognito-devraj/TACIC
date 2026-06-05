const fs = require("fs");
const path = require("path");

const {
  ignoredFolders,
  ignoredFiles,
  ignoredPathContains,
  allowedExtensions,
} = require("./ignoreRules");

function scanDirectory(rootFolder) {
  let files = [];
  let folders = 0;
  let totalLines = 0;

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath);

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry);
      if (
        ignoredPathContains.some(pathPart =>
          fullPath.includes(pathPart)
        )
      ) {
        continue;
      }

      let stat;

      try {
        stat = fs.statSync(fullPath);
      } catch {
        continue;
      }

      if (stat.isDirectory()) {

        // Skip unwanted folders
        if (
          ignoredFolders.some(folder =>
            fullPath.includes(folder)
          )
        ) {
          continue;
        }

        folders++;

        walk(fullPath);

      } else {

        // Skip lock files
        if (ignoredFiles.includes(entry)) {
          continue;
        }

        const ext = path.extname(entry).toLowerCase();

        // Only allow source-code files
        if (
          ext &&
          !allowedExtensions.includes(ext)
        ) {
          continue;
        }

        let lineCount = 0;

        try {
          const content =
            fs.readFileSync(fullPath, "utf8");

          lineCount =
            content.split("\n").length;

          totalLines += lineCount;

        } catch { }

        files.push({
          name: entry,

          path: path.relative(
            rootFolder,
            fullPath
          ),

          fullPath,

          size: stat.size,

          lines: lineCount,
        });
      }
    }
  }

  walk(rootFolder);

  return {
    totalFiles: files.length,
    totalFolders: folders,
    totalLines,
    files,
  };
}

module.exports = {
  scanDirectory,
};