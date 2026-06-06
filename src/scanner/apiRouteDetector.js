const fs = require("fs");

function detectApiRoutes(files) {

    const routes = [];

    const expressRegex =
        /(app|router)\.(get|post|put|delete|patch)\s*\(\s*["'`](.*?)["'`]\s*,\s*([a-zA-Z0-9_]+)/g;

    const fastifyRegex =
        /fastify\.(get|post|put|delete|patch)\s*\(\s*["'`](.*?)["'`]\s*,/g;

    for (const file of files) {

        try {

            const content =
                fs.readFileSync(
                    file.fullPath,
                    "utf8"
                );

            let match;

            while (
                (match =
                    expressRegex.exec(content))
            ) {

                routes.push({
                    framework: "Express",
                    method:
                        match[2].toUpperCase(),
                    path:
                        match[3],
                    controller:
                        match[4],
                    file:
                        file.path
                });
            }

            while (
                (match =
                    fastifyRegex.exec(content))
            ) {

                routes.push({
                    framework: "Fastify",
                    method:
                        match[1].toUpperCase(),
                    path:
                        match[2],
                    controller:
                        "Anonymous Handler",
                    file:
                        file.path
                });
            }

        } catch { }
    }

    return routes;
}

module.exports = {
    detectApiRoutes
};