function generateInstallationGuide(
    techStack
) {

    let output = "";

    if (
        techStack.includes("Electron")
    ) {

        output +=
`1. Install dependencies

npm install

2. Start application

npm start
`;
    }

    else {

        output +=
`Install dependencies

Run project
`;
    }

    return output;
}

module.exports = {
    generateInstallationGuide
};