function generateArchitectureDocumentation(
    architecture,
    projectOverview
) {

    let output = "";

    output +=
        `Architecture Score: ${architecture.architectureScore}/100\n\n`;

    output +=
        "Frontend\n";

    output +=
        "-------------------------------------\n";

    projectOverview.architecture.frontend
        .forEach(item => {

            output +=
                `- ${item}\n`;

        });

    output += "\n";

    output +=
        "Backend\n";

    output +=
        "-------------------------------------\n";

    projectOverview.architecture.backend
        .forEach(item => {

            output +=
                `- ${item}\n`;

        });

    output += "\n";

    output +=
        "Layers\n";

    output +=
        "-------------------------------------\n";

    output +=
        `Presentation: ${architecture.layers.presentation}\n`;

    output +=
        `Application: ${architecture.layers.application}\n`;

    output +=
        `Data: ${architecture.layers.data}\n`;

    return output;
}

module.exports = {
    generateArchitectureDocumentation
};