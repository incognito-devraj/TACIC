const fs = require("fs");

function detectDeadCode(files) {

    const deadFunctions = [];

    files.forEach(file => {

        try {

            const content =
                fs.readFileSync(
                    file.fullPath,
                    "utf8"
                );

            const functions =
                content.match(
                    /function\s+([a-zA-Z0-9_]+)/g
                ) || [];

            functions.forEach(fn => {

                const name =
                    fn.replace(
                        "function ",
                        ""
                    );

                const usages =
                    (
                        content.match(
                            new RegExp(
                                name,
                                "g"
                            )
                        ) || []
                    ).length;

                if (usages <= 1) {

                    deadFunctions.push({
                        file: file.path,
                        function: name
                    });
                }

            });

        } catch {}
    });

    return deadFunctions;
}

module.exports = {
    detectDeadCode
};