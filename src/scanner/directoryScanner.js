const {
  generateRequestFlowDocumentation
} = require(
  "../documentation/requestFlowDocGenerator"
);

const {
  detectRequestFlows
} = require(
  "./requestFlowDetector"
);

const {
  generateModuleDocumentation
} = require(
  "../documentation/moduleDocGenerator"
);

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

const {
  generateRepositoryUnderstanding
} = require("../ai/repositoryUnderstanding");

const {
  generateArchitectureExplanation
} = require("../ai/architectureExplainer");

const {
  generateDependencyIntelligence
} = require("../ai/dependencyIntelligence");

const {
  generateOnboardingGuide
} = require("../ai/onboardingGenerator");

const {
  generateReadme
} = require(
  "../documentation/readmeGenerator"
);

const {
  generateApiDocumentation
} = require(
  "../documentation/apiDocGenerator"
);

const {
  generateArchitectureDocumentation
} = require(
  "../documentation/architectureDocGenerator"
);

const {
  generateInstallationGuide
} = require(
  "../documentation/installationGuideGenerator"
);

const {
  analyzeComplexity
} = require(
  "../analyzer/complexityAnalyzer"
);

const {
  detectLargeFiles
} = require(
  "../analyzer/largeFileDetector"
);

const {
  detectDeadCode
} = require(
  "../analyzer/deadCodeDetector"
);

const {
  detectDuplicateCode
} = require(
  "../analyzer/duplicateCodeDetector"
);

const {
  generateTechnicalDebt
} = require(
  "../analyzer/technicalDebtAnalyzer"
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

        if (
          stat.size >
          500 * 1024
        ) {
          continue;
        }
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
  const requestFlows =
  detectRequestFlows(
    files
  );

  const requestFlowDocumentation =
  generateRequestFlowDocumentation(
    requestFlows
  );


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

  const repositoryUnderstanding =
    generateRepositoryUnderstanding({
      projectOverview,
      dependencyGraph,
      files
    });

  const architectureExplanation =
    generateArchitectureExplanation({
      projectOverview,
      architecture
    });

  const dependencyIntelligence =
    generateDependencyIntelligence({
      architecture
    });

  const onboardingGuide =
    generateOnboardingGuide({
      projectOverview
    });

  const generatedReadme =
    generateReadme({
      projectOverview,
      techStack,
      dependencies,
      files
    });

  const moduleDocumentation =
  generateModuleDocumentation(
    files
  );

const apiDocumentation =
  generateApiDocumentation(
    apiRoutes
  );

const architectureDocumentation =
  generateArchitectureDocumentation(
    architecture,
    projectOverview
  );

const installationGuide =
  generateInstallationGuide(
    techStack
  );


  const complexityAnalysis =
    files.map(file => {

      try {

        const content =
          fs.readFileSync(
            file.fullPath,
            "utf8"
          );

        return {
          file: file.path,
          score:
            analyzeComplexity(
              content
            )
        };

      } catch {

        return {
          file: file.path,
          score: 0
        };
      }

    });

  const largeFiles =
    detectLargeFiles(files);

  const deadCode =
    detectDeadCode(files);

  const duplicateCode =
    detectDuplicateCode(files);

  const technicalDebt =
    generateTechnicalDebt({

      complexity:
        complexityAnalysis,

      largeFiles,

      deadCode,

      duplicates:
        duplicateCode

    });

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
    repositoryUnderstanding,
    architectureExplanation,
    dependencyIntelligence,
    onboardingGuide,

    complexityAnalysis,
    largeFiles,
    deadCode,
    duplicateCode,
    technicalDebt,
    generatedReadme,

    moduleDocumentation,
    apiDocumentation,
    architectureDocumentation,
    installationGuide,

    requestFlows,
    requestFlowDocumentation,
  };
}

module.exports = {
  scanDirectory,
};