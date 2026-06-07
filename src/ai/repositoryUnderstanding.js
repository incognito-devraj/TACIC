function generateRepositoryUnderstanding({
    projectOverview,
    dependencyGraph,
    files
}) {

    const importantFiles =
        projectOverview.entryPoints || [];

    return {
        projectName:
            projectOverview.projectName,

        purpose:
            projectOverview.purpose,

        tech:
            [
                ...(projectOverview.architecture.frontend || []),
                ...(projectOverview.architecture.backend || []),
                ...(projectOverview.architecture.database || [])
            ],

        executionFlow: [

            ...importantFiles,

            dependencyGraph.nodes.length
                ? dependencyGraph.nodes[0]
                : null

        ].filter(Boolean),

        importantFiles,

        totalFiles:
            files.length
    };
}

module.exports = {
    generateRepositoryUnderstanding
};