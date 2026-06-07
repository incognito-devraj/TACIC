function generateArchitectureExplanation({
    projectOverview,
    architecture
}) {

    return {

        pattern:
            "Layered Architecture",

        frontend:
            projectOverview.architecture.frontend,

        backend:
            projectOverview.architecture.backend,

        database:
            projectOverview.architecture.database,

        score:
            architecture.architectureScore,

        strengths: [

            "Modular scanners",

            "Dependency analysis",

            "Architecture intelligence"

        ],

        risks: [

            architecture.deadFiles.length
                ? "Dead files detected"
                : "No dead files",

            architecture.dependencyStats
                .circularDependencyCount
                ? "Circular dependencies found"
                : "No circular dependencies"

        ]
    };
}

module.exports = {
    generateArchitectureExplanation
};