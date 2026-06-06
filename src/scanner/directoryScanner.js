const {
  detectInternalDependencies,
} = require("./dependencyScanner");

const {
  buildGraph,
} = require("../analyzer/graphBuilder");

const {
  detectCircularDependencies,
} = require("../analyzer/circularDetector");
const fs = require("fs");
const path = require("path");

const {
  ignoredFolders,
  ignoredFiles,
  ignoredPathContains,
  allowedExtensions,
  blockedExtensions
} = require("./ignoreRules");

const {
  detectLanguages,
  detectTechStack,
} = require("./projectDetector");

const {
  detectDependencies,
} = require("./dependencyDetector");

const {
  detectApiRoutes,
} = require("./apiRouteDetector");

const {
  detectDatabaseSchemas,
} = require("./databaseSchemaDetector");

const {
  detectRelationships,
} = require(
  "./databaseRelationshipDetector"
);

const {
  generateDatabaseOverview,
} = require(
  "./databaseOverview"
);

const {
  detectNestRoutes,
} = require("./nestRouteDetector");

const {
  generateProjectOverview,
} = require("./projectSummarizer");

const {
  analyzeArchitecture,
} = require(
  "../analyzer/architectureAnalyzer"
);

const {
  buildVisualizationData,
} = require(
  "../analyzer/visualizationBuilder"
);

function scanDirectory(rootFolder) {
  let files = [];
  let folders = 0;
  let totalLines = 0;
  let skippedSensitiveFiles = 0;

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

        if (ignoredFiles.includes(entry)) {
          skippedSensitiveFiles++;
          continue;
        }

        const ext = path.extname(entry).toLowerCase();

        if (blockedExtensions.includes(ext)) {
          skippedSensitiveFiles++;
          continue;
        }

        if (
          ext &&
          !allowedExtensions.includes(ext)
        ) {
          continue;
        }

        let lineCount = 0;

        try {
          const content = fs.readFileSync(
            fullPath,
            "utf8"
          );

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

  const languages =
    detectLanguages(files);

  const techStack =
    detectTechStack(files);

  const dependencies =
    detectDependencies(rootFolder);

  const projectOverview =
    generateProjectOverview({
      rootFolder,

      techStack,

      fileSummaries: files.map(file => ({
        filePath: file.path,
      })),
    });

  const expressAndFastifyRoutes =
    detectApiRoutes(files);

  const nestRoutes =
    detectNestRoutes(files);

  const apiRoutes = [
    ...expressAndFastifyRoutes,
    ...nestRoutes
  ];

  const databaseSchemas =
    detectDatabaseSchemas(
      files
    );

  const databaseRelationships =
    detectRelationships(
      files
    );

  const databaseOverview =
    generateDatabaseOverview(
      databaseSchemas,
      databaseRelationships
    );

  const dependencyMap =
    detectInternalDependencies(
      files,
      rootFolder
    );

  const dependencyGraph =
    buildGraph(
      dependencyMap
    );

  const circularDependencies =
    detectCircularDependencies(
      dependencyMap
    );

  const architecture =
    analyzeArchitecture(
      dependencyGraph,
      circularDependencies,
      files,
      projectOverview.entryPoints
    );

  const visualizationData =
    buildVisualizationData(
      dependencyGraph
    );

  return {
    totalFiles: files.length,
    totalFolders: folders,
    totalLines,

    skippedSensitiveFiles,

    languages,
    techStack,
    dependencies,
    projectOverview,
    apiRoutes,

    databaseSchemas,
    databaseRelationships,
    databaseOverview,

    files,

    dependencyMap,
    dependencyGraph,
    circularDependencies,
    architecture,
    visualizationData,
  };
}

module.exports = {
  scanDirectory,
};