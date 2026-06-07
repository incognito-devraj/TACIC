function generateOnboardingGuide({
    projectOverview
}) {

    return [

        "Read entry points",

        "Understand project structure",

        "Study scanner modules",

        "Study analyzer modules",

        "Review export generator",

        `Project Name: ${projectOverview.projectName}`

    ];
}

module.exports = {
    generateOnboardingGuide
};