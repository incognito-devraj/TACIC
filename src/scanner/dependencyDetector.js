const fs = require("fs");
const path = require("path");

function detectDependencies(rootFolder) {
  const packageJsonPath =
    path.join(rootFolder, "package.json");

  const result = {
    dependencies: {},
    devDependencies: {},
  };

  if (!fs.existsSync(packageJsonPath)) {
    return result;
  }

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf8")
    );

    result.dependencies =
      packageJson.dependencies || {};

    result.devDependencies =
      packageJson.devDependencies || {};

  } catch (err) {
    console.log(
      "Failed to read package.json"
    );
  }

  return result;
}

module.exports = {
  detectDependencies,
};