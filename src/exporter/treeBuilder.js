function generateTree(files) {
  const tree = {};

  for (const file of files) {
    const parts = file.path.split("\\");

    let current = tree;

    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }

      current = current[part];
    }
  }

  const lines = [];

  function build(node, prefix = "") {
    const entries = Object.keys(node);

    entries.forEach((entry, index) => {
      const isLast =
        index === entries.length - 1;

      lines.push(
        `${prefix}${isLast ? "└── " : "├── "}${entry}`
      );

      build(
        node[entry],
        prefix + (isLast ? "    " : "│   ")
      );
    });
  }

  build(tree);

  return lines.join("\n");
}

module.exports = {
  generateTree,
};