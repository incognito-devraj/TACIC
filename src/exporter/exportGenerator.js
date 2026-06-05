const { containsSecrets } =
  require("../scanner/secretDetector");
const { generateTree } = require("./treeBuilder");
const fs = require("fs");

const {
  analyzeCode,
} = require(
  "../scanner/astAnalyzer"
);

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
    `Languages: ${scanResult.languages?.join(", ") || "Unknown"
    }\n`;

  output +=
    `Tech Stack: ${scanResult.techStack?.join(", ") || "Unknown"
    }\n\n`;

  output +=
    "Security: Sensitive files excluded, secrets redacted\n\n";
  output +=
    "DEPENDENCIES\n";

  output +=
    "=====================================\n\n";

  for (const [name, version] of Object.entries(
    scanResult.dependencies?.dependencies || {}
  )) {
    output += `${name}: ${version}\n`;
  }

  output += "\n";
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
      const analysis =
        analyzeCode(content);

      output += "ANALYSIS\n";
      output +=
        "=====================================\n\n";

      output += "Functions:\n";

      if (analysis.functions.length) {
        analysis.functions.forEach(fn => {
          output += `- ${fn}\n`;
        });
      } else {
        output += "- None\n";
      }

      output += "\nClasses:\n";

      if (analysis.classes.length) {
        analysis.classes.forEach(cls => {
          output += `- ${cls}\n`;
        });
      } else {
        output += "- None\n";
      }

      output += "\nImports:\n";

      if (analysis.imports.length) {
        analysis.imports.forEach(imp => {
          output += `- ${imp}\n`;
        });
      } else {
        output += "- None\n";
      }

      output += "\nExports:\n";

      if (analysis.exports.length) {
        analysis.exports.forEach(exp => {
          output += `- ${exp}\n`;
        });
      } else {
        output += "- None\n";
      }

      output += "\n";

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