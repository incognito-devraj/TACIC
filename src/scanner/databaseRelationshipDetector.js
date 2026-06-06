const fs = require("fs");

function detectRelationships(files) {

    const relationships = [];

    files.forEach(file => {

        try {

            const content =
                fs.readFileSync(
                    file.fullPath,
                    "utf8"
                );

            detectMongooseRefs(
                content,
                file,
                relationships
            );

            detectPrismaRelations(
                content,
                file,
                relationships
            );

            detectSequelizeRelations(
                content,
                file,
                relationships
            );

            detectSqlForeignKeys(
                content,
                file,
                relationships
            );

        } catch {}
    });

    return relationships;
}

function detectMongooseRefs(
    content,
    file,
    relationships
) {

    const regex =
        /ref\s*:\s*["'`](.*?)["'`]/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        relationships.push({
            type: "Mongoose Ref",
            target: match[1],
            file: file.path
        });
    }
}

function detectPrismaRelations(
    content,
    file,
    relationships
) {

    const regex =
        /@relation\s*\(/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        relationships.push({
            type: "Prisma Relation",
            file: file.path
        });
    }
}

function detectSequelizeRelations(
    content,
    file,
    relationships
) {

    const regex =
        /\.(belongsTo|hasMany|belongsToMany|hasOne)\s*\(/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        relationships.push({
            type: match[1],
            file: file.path
        });
    }
}

function detectSqlForeignKeys(
    content,
    file,
    relationships
) {

    const regex =
        /FOREIGN\s+KEY.*?REFERENCES\s+([A-Za-z0-9_]+)/gi;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        relationships.push({
            type: "Foreign Key",
            target: match[1],
            file: file.path
        });
    }
}

module.exports = {
    detectRelationships
};