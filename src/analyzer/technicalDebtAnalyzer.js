function generateTechnicalDebt({

    complexity,

    largeFiles,

    deadCode,

    duplicates

}) {

    let score = 100;

    score -= largeFiles.length * 2;

    score -= deadCode.length;

    score -= duplicates.length * 3;

    return {

        debtScore:
            Math.max(score, 0),

        largeFiles:
            largeFiles.length,

        deadCode:
            deadCode.length,

        duplicates:
            duplicates.length
    };
}

module.exports = {
    generateTechnicalDebt
};