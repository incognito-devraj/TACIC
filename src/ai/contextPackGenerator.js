function generateContextPack(scanResult) {

    let output = "";

    output +=
        "=====================================\n";

    output +=
        "AI CONTEXT PACK\n";

    output +=
        "=====================================\n\n";



    output +=
        "AI PROJECT SUMMARY\n";

    output +=
        "-------------------------------------\n";

    output +=
        `Project: ${scanResult.projectOverview.projectName}\n`;

    output +=
        `Purpose: ${scanResult.projectOverview.purpose}\n`;

    output +=
        `Files: ${scanResult.totalFiles}\n\n`;



    output +=
        "REPOSITORY UNDERSTANDING\n";

    output +=
        "-------------------------------------\n";

    output +=
        `Important Files:\n`;

    scanResult.repositoryUnderstanding
        .importantFiles
        .forEach(file => {

            output +=
                `- ${file}\n`;

        });



    output += "\n";



    output +=
        "ARCHITECTURE EXPLANATION\n";

    output +=
        "-------------------------------------\n";

    output +=
        `Pattern: ${scanResult.architectureExplanation.pattern}\n`;

    output +=
        `Score: ${scanResult.architectureExplanation.score}/100\n\n`;



    output +=
        "DEPENDENCY INTELLIGENCE\n";

    output +=
        "-------------------------------------\n";

    output +=
        `Critical File: ${scanResult.dependencyIntelligence.criticalFile}\n`;

    output +=
        `Connections: ${scanResult.dependencyIntelligence.connections}\n\n`;



    output +=
        "DEVELOPER ONBOARDING\n";

    output +=
        "-------------------------------------\n";

    scanResult.onboardingGuide
        .forEach(step => {

            output +=
                `- ${step}\n`;

        });



    output += "\n";



    output +=
        "AI INSTRUCTIONS\n";

    output +=
        "-------------------------------------\n";

    output +=
`You are analyzing this repository.

Preserve architecture.

Preserve dependency graph generation.

Preserve scanner modules.

Preserve exporter modules.

Use entry points as the starting point.
`;

    output += "\n";

    return output;
}

module.exports = {
    generateContextPack
};