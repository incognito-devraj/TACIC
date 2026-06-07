const fs = require("fs");

function detectDuplicateCode(files) {

    const duplicates = [];

    const seen = {};

    files.forEach(file => {

        try {

            const content =
                fs.readFileSync(
                    file.fullPath,
                    "utf8"
                );

            const hash =
                content.replace(/\s+/g, "");

            if (seen[hash]) {

                duplicates.push({
                    file1: seen[hash],
                    file2: file.path
                });

            } else {

                seen[hash] = file.path;
            }

        } catch {}
    });

    return duplicates;
}

module.exports = {
    detectDuplicateCode
};