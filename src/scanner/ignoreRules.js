const ignoredFolders = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  ".vercel",
  ".vite",
];

const ignoredFiles = [
  ".gitignore",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
];

const ignoredPathContains = [
  "src\\components\\ui"
];

const allowedExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".html",
  ".json",
];

module.exports = {
  ignoredFolders,
  ignoredFiles,
  ignoredPathContains,
  allowedExtensions,
};