const fs = require("fs");

function detectRequestFlows(files) {

    const flows = [];

    files.forEach(file => {

        try {

            const content =
                fs.readFileSync(
                    file.fullPath,
                    "utf8"
                );

            detectElectronFlows(
                content,
                file,
                flows
            );

            detectExpressFlows(
                content,
                file,
                flows
            );

        } catch {}
    });

    return flows;
}

function detectElectronFlows(
    content,
    file,
    flows
) {

    const regex =
        /ipcRenderer\.invoke\s*\(\s*["'`](.*?)["'`]/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        flows.push({
            type: "Electron IPC",
            action: match[1],
            source: file.path
        });
    }
}

function detectExpressFlows(
    content,
    file,
    flows
) {

    const regex =
        /(app|router)\.(get|post|put|delete|patch)\s*\(\s*["'`](.*?)["'`]/g;

    let match;

    while (
        (match = regex.exec(content))
    ) {

        flows.push({
            type: "API Route",
            method:
                match[2].toUpperCase(),
            path:
                match[3],
            source:
                file.path
        });
    }
}

module.exports = {
    detectRequestFlows
};