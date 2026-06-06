function buildVisualizationData(graph) {
    return {
        nodes: graph.nodes.map(node => ({
            id: node,
            label: node,
            type: detectNodeType(node)
        })),

        links: graph.edges.map(edge => ({
            source: edge.from,
            target: edge.to
        }))
    };
}

function detectNodeType(file) {

    const name = file.toLowerCase();

    if (
        name.includes("renderer") ||
        name.includes("html")
    ) {
        return "presentation";
    }

    if (
        name.includes("scanner") ||
        name.includes("exporter") ||
        name.includes("analyzer")
    ) {
        return "application";
    }

    return "other";
}

module.exports = {
    buildVisualizationData
};