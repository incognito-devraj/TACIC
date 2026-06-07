function detectLargeFiles(files) {

    return files.filter(
        file => file.lines > 500
    );
}

module.exports = {
    detectLargeFiles
};