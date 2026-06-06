function buildGraph(dependencyMap) {

    const nodeSet = new Set();
    const edges = [];

    for (
        const [file, deps]
        of Object.entries(
            dependencyMap
        )
    ) {

        nodeSet.add(file);

        deps.forEach(dep => {

            nodeSet.add(dep);

            edges.push({
                from: file,
                to: dep,
            });

        });
    }

    return {
        nodes: [...nodeSet],
        edges,
    };
}

module.exports = {
    buildGraph,
};