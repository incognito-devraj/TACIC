function analyzeComplexity(content) {

    const patterns = [
        /\bif\b/g,
        /\belse\b/g,
        /\bswitch\b/g,
        /\bcase\b/g,
        /\bfor\b/g,
        /\bwhile\b/g,
        /\bcatch\b/g,
        /\?/g
    ];

    let score = 1;

    patterns.forEach(regex => {

        const matches =
            content.match(regex);

        score += matches
            ? matches.length
            : 0;
    });

    return score;
}

module.exports = {
    analyzeComplexity
};