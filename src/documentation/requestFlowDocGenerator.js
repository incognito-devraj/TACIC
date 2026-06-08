function generateRequestFlowDocumentation(
    flows
) {

    let output = "";

    if (!flows.length) {

        return "No Request Flows Detected\n";
    }

    flows.forEach(flow => {

        output +=
            `${flow.type}\n`;

        if (flow.method) {

            output +=
                `${flow.method} ${flow.path}\n`;
        }

        if (flow.action) {

            output +=
                `${flow.action}\n`;
        }

        output +=
            `File: ${flow.source}\n\n`;
    });

    return output;
}

module.exports = {
    generateRequestFlowDocumentation
};