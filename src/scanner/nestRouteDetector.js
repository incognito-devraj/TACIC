const fs = require("fs");

function detectNestRoutes(files) {

    const routes = [];

    for (const file of files) {

        if (
            !file.path.endsWith(".ts") &&
            !file.path.endsWith(".js")
        ) {
            continue;
        }

        try {

            const content =
                fs.readFileSync(
                    file.fullPath,
                    "utf8"
                );

            const controllerMatch =
                content.match(
                    /@Controller\s*\(\s*["'`](.*?)["'`]\s*\)/
                );

            if (!controllerMatch) {
                continue;
            }

            const baseRoute =
                controllerMatch[1];

            const routeRegex =
                /@(Get|Post|Put|Delete|Patch)\s*\(\s*["'`]?(.*?)["'`]?\s*\)[\s\S]*?([a-zA-Z0-9_]+)\s*\(/g;

            let match;

            while (
                (match =
                    routeRegex.exec(content))
            ) {

                routes.push({
                    framework: "NestJS",
                    method:
                        match[1].toUpperCase(),
                    path:
                        "/" +
                        baseRoute +
                        (
                            match[2]
                                ? "/" + match[2]
                                : ""
                        ),
                    controller:
                        match[3],
                    file:
                        file.path
                });
            }

        } catch { }
    }

    return routes;
}

module.exports = {
    detectNestRoutes
};
