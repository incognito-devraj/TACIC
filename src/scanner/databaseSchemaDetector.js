const fs = require("fs");

function detectDatabaseSchemas(files) {

    const entities = [];

    files.forEach(file => {

        try {

            const content =
                fs.readFileSync(
                    file.fullPath,
                    "utf8"
                );

            detectMongoose(
                content,
                file,
                entities
            );

            detectPrisma(
                content,
                file,
                entities
            );

            detectSequelize(
                content,
                file,
                entities
            );

            detectSqlTables(
                content,
                file,
                entities
            );

        } catch {}
    });

    return {
    entities,
    relationships: []
};
}

function detectMongoose(
    content,
    file,
    entities
) {

    const regex =
    /(mongoose\.model|model)\s*\(\s*["'`]([A-Za-z0-9_]+)["'`]/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        entities.push({
            name: match[2],
            type: "Mongoose",
            file: file.path
        });
    }
}

function detectPrisma(
    content,
    file,
    entities
) {

    const regex =
        /model\s+([A-Za-z0-9_]+)\s*\{/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        entities.push({
            name: match[1],
            type: "Prisma",
            file: file.path
        });
    }
}

function detectSequelize(
    content,
    file,
    entities
) {

    const regex =
        /sequelize\.define\s*\(\s*["'`](.*?)["'`]/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        entities.push({
            name: match[1],
            type: "Sequelize",
            file: file.path
        });
    }
}

function detectSqlTables(
    content,
    file,
    entities
) {

    const regex =
        /CREATE\s+TABLE\s+([A-Za-z0-9_]+)/gi;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        entities.push({
            name: match[1],
            type: "SQL",
            file: file.path
        });
    }
}

module.exports = {
    detectDatabaseSchemas
};