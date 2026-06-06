function analyzeArchitecture(
    dependencyGraph,
    circularDependencies,
    files,
    entryPoints = []
) {

    const stats =
        calculateDependencyStats(
            dependencyGraph,
            circularDependencies
        );

    const mostConnectedFile =
        findMostConnectedFile(
            dependencyGraph
        );

    const deadFiles =
        detectDeadFiles(
            dependencyGraph,
            entryPoints
        );

    const layers =
        detectLayers(files);

    const architectureScore =
        calculateArchitectureScore({
            circularDependencies,
            deadFiles,
            dependencyGraph
        });

    return {
        mostConnectedFile,
        dependencyStats: stats,
        deadFiles,
        layers,
        architectureScore
    };
}

function calculateDependencyStats(
    graph,
    circularDependencies
) {

    return {
        totalNodes:
            graph.nodes.length,

        totalEdges:
            graph.edges.length,

        averageDependencies:
            graph.nodes.length
                ? (
                    graph.edges.length /
                    graph.nodes.length
                ).toFixed(2)
                : 0,

        circularDependencyCount:
            circularDependencies.length
    };
}

function findMostConnectedFile(
    graph
) {

    const counts = {};

    graph.edges.forEach(edge => {

        counts[edge.from] =
            (counts[edge.from] || 0) + 1;

        counts[edge.to] =
            (counts[edge.to] || 0) + 1;
    });

    let winner = null;
    let max = 0;

    Object.entries(counts)
        .forEach(([file, count]) => {

            if (count > max) {
                max = count;
                winner = file;
            }
        });

    return {
        file: winner,
        connections: max
    };
}

function detectDeadFiles(
    graph,
    entryPoints
) {

    const imported = new Set();

    graph.edges.forEach(edge => {
        imported.add(edge.to);
    });

    return graph.nodes.filter(
        node =>
            !imported.has(node) &&
            !entryPoints.includes(node)
    );
}

function detectLayers(files) {

    const layers = {
        presentation: 0,
        application: 0,
        data: 0
    };

    files.forEach(file => {

        const name =
            file.path.toLowerCase();

        if (
            name.includes("renderer") ||
            name.includes("view") ||
            name.includes("ui") ||
            name.endsWith(".html")
        ) {
            layers.presentation++;
        }

        else if (
            name.includes("service") ||
            name.includes("manager") ||
            name.includes("scanner") ||
            name.includes("exporter")
        ) {
            layers.application++;
        }

        else if (
            name.includes("dao") ||
            name.includes("repository") ||
            name.includes("database") ||
            name.includes("model")
        ) {
            layers.data++;
        }

    });

    return layers;
}

function calculateArchitectureScore({
    circularDependencies,
    deadFiles,
    dependencyGraph
}) {

    let score = 100;

    score -=
        circularDependencies.length * 10;

    score -=
        deadFiles.length * 5;

    const density =
        dependencyGraph.nodes.length
            ? dependencyGraph.edges.length /
            dependencyGraph.nodes.length
            : 0;

    if (density > 3) {
        score -= 15;
    }

    return Math.max(0, score);
}

module.exports = {
    analyzeArchitecture
};