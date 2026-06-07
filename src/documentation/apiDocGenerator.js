function generateApiDocumentation(routes) {

    let output = "";

    if (!routes.length) {

        return "No API Routes Detected\n";
    }

    routes.forEach(route => {

        output +=
            `${route.method} ${route.path}\n`;

        output +=
            `Framework: ${route.framework}\n`;

        output +=
            `Controller: ${route.controller}\n`;

        output +=
            `File: ${route.file}\n\n`;
    });

    return output;
}

module.exports = {
    generateApiDocumentation
};