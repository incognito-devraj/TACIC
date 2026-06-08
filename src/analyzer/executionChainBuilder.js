function buildExecutionChains(
    requestFlows
) {

    const chains = [];

    requestFlows.forEach(flow => {

        if (
            flow.type === "Electron IPC"
        ) {

            chains.push({
                trigger:
                    flow.action,

                chain: [

                    "renderer.js",

                    "preload.js",

                    "ipcRenderer.invoke()",

                    "main.js",

                    `ipcMain.handle("${flow.action}")`

                ]
            });
        }

        if (
            flow.type === "API Route"
        ) {

            chains.push({
                trigger:
                    `${flow.method} ${flow.path}`,

                chain: [

                    "Route",

                    "Controller",

                    "Service",

                    "Repository",

                    "Database"

                ]
            });
        }

    });

    return chains;
}

module.exports = {
    buildExecutionChains
};