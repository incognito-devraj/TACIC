function generateDatabaseOverview(
    schemas,
    relationships
) {

    const databaseTypes =
        [...new Set(
            schemas.entities.map(
                e => e.type
            )
        )];

    return {

        totalEntities:
            schemas.entities.length,

        totalRelationships:
            relationships.length,

        databaseTypes,

        summary:
            buildSummary(
                schemas.entities.length,
                relationships.length,
                databaseTypes
            )
    };
}

function buildSummary(
    entities,
    relationships,
    types
) {

    return `
Database Types:
${types.join(", ") || "Unknown"}

Entities:
${entities}

Relationships:
${relationships}
`.trim();
}

module.exports = {
    generateDatabaseOverview
};
