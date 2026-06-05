const { containsSecrets } =
  require("../scanner/secretDetector");
const { generateTree } = require("./treeBuilder");
const fs = require("fs");

function generateExport(scanResult, rootFolder) {
  let output = "";

  output += "=====================================\n";
  output += "CODEBASE EXPORT\n";
  output += "=====================================\n\n";

  output += `Root Folder: ${rootFolder}\n`;
  output += `Files: ${scanResult.totalFiles}\n`;
  output += `Folders: ${scanResult.totalFolders}\n`;
  output += `Lines Of Code: ${scanResult.totalLines}\n\n`;
  output +=
    "Security: Sensitive files excluded, secrets redacted\n\n";
  output += "PROJECT STRUCTURE\n";
  output += "=====================================\n\n";
  output += generateTree(scanResult.files);
  output += "\n\n";

  for (const file of scanResult.files) {
    output += "\n\n";
    output += "=====================================\n";
    output += `FILE: ${file.path}\n`;
    output += `LINES: ${file.lines}\n`;
    output += "=====================================\n\n";

    try {
      let content = fs.readFileSync(
        file.fullPath,
        "utf8"
      );

      if (containsSecrets(content)) {

        content = content
          .replace(
            /(API_KEY\s*=\s*).*/gi,
            "$1[REDACTED]"
          )
          .replace(
            /(SECRET\s*=\s*).*/gi,
            "$1[REDACTED]"
          )
          .replace(
            /(TOKEN\s*=\s*).*/gi,
            "$1[REDACTED]"
          )
          .replace(
            /(PASSWORD\s*=\s*).*/gi,
            "$1[REDACTED]"
          );
      }

      output += content;
    } catch (err) {
      output += "[Unable to read file]";
    }

    output += "\n";
  }

  return output;
}

module.exports = {
  generateExport,
};