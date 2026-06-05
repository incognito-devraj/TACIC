const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function analyzeCode(code) {
  const result = {
    functions: [],
    classes: [],
    imports: [],
    exports: [],
  };

  try {
    const ast = parser.parse(code, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript"],
    });

    traverse(ast, {
      FunctionDeclaration(path) {
        if (path.node.id) {
          result.functions.push(
            path.node.id.name
          );
        }
      },

      ClassDeclaration(path) {
        if (path.node.id) {
          result.classes.push(
            path.node.id.name
          );
        }
      },

      ImportDeclaration(path) {
        result.imports.push(
          path.node.source.value
        );
      },

      ExportNamedDeclaration(path) {
        if (
          path.node.declaration &&
          path.node.declaration.id
        ) {
          result.exports.push(
            path.node.declaration.id.name
          );
        }
      },
    });

  } catch {}

  return result;
}

module.exports = {
  analyzeCode,
};