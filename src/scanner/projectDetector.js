const path = require("path");

function detectLanguages(files) {
  const languages = new Set();

  const extensionMap = {
    ".js": "JavaScript",
    ".jsx": "React JSX",
    ".ts": "TypeScript",
    ".tsx": "React TSX",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".json": "JSON",
    ".java": "Java",
    ".py": "Python",
    ".php": "PHP",
    ".cs": "C#",
  };

  for (const file of files) {
    const ext = path.extname(file.name);

    if (extensionMap[ext]) {
      languages.add(extensionMap[ext]);
    }
  }

  return [...languages];
}

function detectTechStack(files) {
  const stack = new Set();

  const fileNames = files.map(f =>
    f.name.toLowerCase()
  );

  const paths = files.map(f =>
    f.path.toLowerCase()
  );

  if (
    fileNames.includes("preload.js") &&
    fileNames.includes("main.js")
  ) {
    stack.add("Electron");
  }

  if (
    paths.some(p =>
      p.endsWith(".jsx") ||
      p.endsWith(".tsx")
    )
  ) {
    stack.add("React");
  }

  if (
    paths.some(p =>
      p.includes("routes")
    )
  ) {
    stack.add("Express");
  }

  return [...stack];
}

module.exports = {
  detectLanguages,
  detectTechStack,
};
