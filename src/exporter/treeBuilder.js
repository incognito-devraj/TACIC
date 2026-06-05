const path = require("path");

function generateTree(files) {
  const lines = [];

  for (const file of files) {
    lines.push(file.path);
  }

  return lines.join("\n");
}

module.exports = {
  generateTree,
};