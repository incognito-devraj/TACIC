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
  output += "\n";
  output +=
    "Security: Sensitive files excluded, secrets redacted\n\n";
  output += "\n";
  output +=
    "DEPENDENCIES\n";

  output +=
    "=====================================\n\n";

  for (const [name, version] of Object.entries(
    scanResult.dependencies?.dependencies || {}
  )) {
    output += `${name}: ${version}\n`;
  }


  output += `Project Name: ${scanResult.projectOverview?.projectName ||
    "Unknown"
    }\n\n`;

  output += "\n";
  output += "PROJECT OVERVIEW\n";
  output += "=====================================\n\n";

  output += `Purpose: ${scanResult.projectOverview?.purpose || "Unknown"
    }\n\n`;

  output += "Architecture\n\n";

  output += `Frontend: ${scanResult.projectOverview?.architecture?.frontend?.join(", ")
    || "N/A"
    }\n`;

  output += `Backend: ${scanResult.projectOverview?.architecture?.backend?.join(", ")
    || "N/A"
    }\n`;

  output += `Database: ${scanResult.projectOverview?.architecture?.database?.join(", ")
    || "N/A"
    }\n\n`;

  output += "Entry Points:\n";

  if (
    scanResult.projectOverview?.entryPoints?.length
  ) {
    scanResult.projectOverview.entryPoints.forEach(
      entry => {
        output += `- ${entry}\n`;
      }
    );
  } else {
    output += "- None Detected\n";
  }

  output += "\n";

  output += "Main Modules:\n";

  if (
    scanResult.projectOverview?.modules?.length
  ) {
    scanResult.projectOverview.modules.forEach(
      module => {
        output += `- ${module}\n`;
      }
    );
  } else {
    output += "- None Detected\n";
  }

  output += "\n";
  output += "ARCHITECTURE INTELLIGENCE\n";
  output +=
    "=====================================\n\n";

  const arch =
    scanResult.architecture;

  output +=
    `Architecture Score: ${arch.architectureScore
    }/100\n\n`;

  output +=
    "Most Connected File:\n";

  if (arch.mostConnectedFile.file) {

    output +=
      `- ${arch.mostConnectedFile.file}
(${arch.mostConnectedFile.connections} connections)\n`;

  } else {

    output +=
      "- None\n";
  }

  output += "\n";

  output +=
    "Dependency Statistics:\n";

  output +=
    `- Nodes: ${arch.dependencyStats.totalNodes}\n`;

  output +=
    `- Edges: ${arch.dependencyStats.totalEdges}\n`;

  output +=
    `- Average Dependencies: ${arch.dependencyStats.averageDependencies}\n`;

  output +=
    `- Circular Dependencies: ${arch.dependencyStats.circularDependencyCount}\n`;

  output += "\n";

  output +=
    "Dead Files:\n";

  if (arch.deadFiles.length) {

    arch.deadFiles.forEach(file => {
      output += `- ${file}\n`;
    });

  } else {

    output += "- None\n";
  }

  output += "\n";

  output +=
    "Layer Distribution:\n";

  output +=
    `- Presentation: ${arch.layers.presentation}\n`;

  output +=
    `- Application: ${arch.layers.application}\n`;

  output +=
    `- Data: ${arch.layers.data}\n`;

  output += "\n";


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