function buildGraph(dependencyMap) {

    const nodes = [];
    const edges = [];

    for (
        const [file, deps]
        of Object.entries(
            dependencyMap
        )
    ) {

        nodes.push(file);

        deps.forEach(dep => {

            edges.push({
                from: file,
                to: dep,
            });

            if (
                !nodes.includes(dep)
            ) {
                nodes.push(dep);
            }
        });
    }

    return {
        nodes,
        edges,
    };
}

module.exports = {
    buildGraph,
};