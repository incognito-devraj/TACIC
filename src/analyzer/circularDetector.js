function detectCircularDependencies(
    dependencyMap
) {

    const cycles = [];

    function dfs(
        node,
        visited,
        stack
    ) {

        if (
            stack.includes(node)
        ) {

            const start =
                stack.indexOf(node);

            cycles.push([
                ...stack.slice(start),
                node
            ]);

            return;
        }

        if (
            visited.has(node)
        ) {
            return;
        }

        visited.add(node);

        const deps =
            dependencyMap[node] || [];

        deps.forEach(dep =>
            dfs(
                dep,
                visited,
                [...stack, node]
            )
        );
    }

    Object.keys(
        dependencyMap
    ).forEach(file => {

        dfs(
            file,
            new Set(),
            []
        );
    });

    return cycles;
}

module.exports = {
    detectCircularDependencies,
};