function generateDependencyIntelligence({
    architecture
}) {

    return {

        criticalFile:
            architecture
                .mostConnectedFile
                .file,

        connections:
            architecture
                .mostConnectedFile
                .connections,

        orphanFiles:
            architecture.deadFiles,

        dependencyStats:
            architecture.dependencyStats
    };
}

module.exports = {
    generateDependencyIntelligence
};