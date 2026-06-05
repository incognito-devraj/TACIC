const fs = require("fs");
const path = require("path");

function detectInternalDependencies(files, rootFolder) {
    const dependencyMap = {};

    const requireRegex =
        /require\s*\(\s*["'](.+?)["']\s*\)/g;

    const importRegex =
        /import\s+.*?\s+from\s+["'](.+?)["']/g;

    for (const file of files) {

        if (!file.path.endsWith(".js")) {
            continue;
        }

        const dependencies = [];

        try {

            const content =
                fs.readFileSync(
                    file.fullPath,
                    "utf8"
                );

            let match;

            while (
                (match =
                    requireRegex.exec(content))
            ) {

                const importPath = match[1];

                if (
                    importPath.startsWith(".")
                ) {
                    dependencies.push(
                        resolveImport(
                            file.path,
                            importPath
                        )
                    );
                }
            }

            while (
                (match =
                    importRegex.exec(content))
            ) {

                const importPath = match[1];

                if (
                    importPath.startsWith(".")
                ) {
                    dependencies.push(
                        resolveImport(
                            file.path,
                            importPath
                        )
                    );
                }
            }

        } catch {}

        dependencyMap[file.path] =
            dependencies;
    }

    return dependencyMap;
}

function resolveImport(
    currentFile,
    importPath
) {

    const currentDir =
        path.dirname(currentFile);

    let resolved =
        path.normalize(
            path.join(
                currentDir,
                importPath
            )
        );

    if (
        !path.extname(resolved)
    ) {
        resolved += ".js";
    }

    return resolved;
}

module.exports = {
    detectInternalDependencies,
};