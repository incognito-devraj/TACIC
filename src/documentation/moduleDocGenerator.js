function generateModuleDocumentation(files) {

    const modules = {};

    files.forEach(file => {

        const parts = file.path.split("\\");

        if (parts.length < 2) {
            return;
        }

        const moduleName = parts[1];

        if (!modules[moduleName]) {
            modules[moduleName] = [];
        }

        modules[moduleName].push(file.name);
    });

    let output = "";

    Object.entries(modules)
        .forEach(([module, files]) => {

            output += `Module: ${module}\n`;

            output +=
                "-------------------------------------\n";

            output +=
                `Files: ${files.length}\n\n`;

            files.forEach(file => {

                output += `- ${file}\n`;

            });

            output += "\n\n";
        });

    return output;
}

module.exports = {
    generateModuleDocumentation
};