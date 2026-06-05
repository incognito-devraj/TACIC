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

  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".env.test",

  ".npmrc",
  ".yarnrc",
  ".pnp.cjs",

  "id_rsa",
  "id_ed25519",
  "known_hosts",

  "credentials.json",
  "service-account.json"
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

const blockedExtensions = [
  ".pem",
  ".key",
  ".crt",
  ".p12",
  ".pfx",
  ".jks",
  ".keystore",
  ".log"
];

module.exports = {
  ignoredFolders,
  ignoredFiles,
  ignoredPathContains,
  allowedExtensions,
  blockedExtensions
};