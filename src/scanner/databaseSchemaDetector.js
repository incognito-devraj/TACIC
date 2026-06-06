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

    const relationships =
        discoverRelationships(
            entities
        );

    return {
        entities,
        relationships
    };
}

function detectMongoose(
    content,
    file,
    entities
) {

    const regex =
        /mongoose\.model\s*\(\s*["'`](.*?)["'`]/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        entities.push({
            name: match[1],
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

function discoverRelationships(
    entities
) {

    const relationships = [];

    entities.forEach(entity => {

        entities.forEach(target => {

            if (
                entity !== target &&
                entity.name
                    .toLowerCase()
                    .includes(
                        target.name.toLowerCase()
                    )
            ) {

                relationships.push({
                    from: entity.name,
                    to: target.name
                });
            }
        });
    });

    return relationships;
}

module.exports = {
    detectDatabaseSchemas
};