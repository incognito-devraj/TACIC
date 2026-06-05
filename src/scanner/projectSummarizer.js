const fs = require("fs");
const path = require("path");


function detectProjectName(rootFolder) {
    try {
        const packageJsonPath =
            path.join(rootFolder, "package.json");

        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(
                fs.readFileSync(
                    packageJsonPath,
                    "utf8"
                )
            );

            if (packageJson.name) {
                return packageJson.name;
            }
        }
    } catch { }

    return path.basename(rootFolder);
}

function detectEntryPoints(fileSummaries) {
    const entryPoints = [];

    const knownEntries = [
        "main.js",
        "server.js",
        "app.js",
        "index.js",
        "main.jsx",
        "main.ts",
        "main.tsx",
        "preload.js"
    ];

    for (const file of fileSummaries) {
        const filePath =
            file.filePath.toLowerCase();

        const fileName =
            filePath.split("\\").pop();

        if (
            knownEntries.includes(fileName)
        ) {
            entryPoints.push(file.filePath);
        }
    }

    return entryPoints;
}

function detectEntryPoints(fileSummaries) {
    const entryPoints = [];

    const knownEntries = [
        "main.js",
        "server.js",
        "app.js",
        "index.js",
        "main.jsx",
        "main.ts",
        "main.tsx",
        "preload.js"
    ];

    for (const file of fileSummaries) {
        const filePath =
            file.filePath.toLowerCase();

        const fileName =
            filePath.split("\\").pop();

        if (
            knownEntries.includes(fileName)
        ) {
            entryPoints.push(file.filePath);
        }
    }

    return entryPoints;
}

function generateProjectOverview(projectInfo) {
    const {
        rootFolder,
        techStack = [],
        fileSummaries = []
    } = projectInfo;

    const modules =
        detectModules(fileSummaries);

    return {
        projectName:
            detectProjectName(rootFolder),

        purpose:
            detectPurpose(modules),

        architecture:
            detectArchitecture(techStack),

        entryPoints:
            detectEntryPoints(fileSummaries),

        modules,
    };
}


function detectModules(fileSummaries) {
    const found = new Set();

    const keywords = {
        auth: "Authentication",
        login: "Authentication",
        register: "Authentication",

        user: "User Management",
        profile: "User Management",

        admin: "Admin Panel",

        group: "Group Management",

        expense: "Expense Tracking",
        payment: "Payments",
        invoice: "Payments",

        product: "Product Management",
        order: "Order Management",

        doctor: "Doctor Management",
        patient: "Patient Management",
        appointment: "Appointment Scheduling",

        student: "Student Management"
    };

    for (const file of fileSummaries) {
        const name = file.filePath.toLowerCase();

        for (const [keyword, module] of Object.entries(keywords)) {
            if (name.includes(keyword)) {
                found.add(module);
            }
        }
    }

    return [...found];
}

function detectArchitecture(techStack) {
    const stack = techStack.join(" ").toLowerCase();

    const frontend = [];
    const backend = [];
    const database = [];

    if (stack.includes("react")) frontend.push("React");
    if (stack.includes("vue")) frontend.push("Vue");
    if (stack.includes("angular")) frontend.push("Angular");

    if (stack.includes("express")) backend.push("Express");
    if (stack.includes("nestjs")) backend.push("NestJS");

    if (stack.includes("mongodb")) database.push("MongoDB");
    if (stack.includes("mysql")) database.push("MySQL");
    if (stack.includes("postgres")) database.push("PostgreSQL");

    return {
        frontend,
        backend,
        database
    };
}

function detectPurpose(modules) {
    if (modules.includes("Expense Tracking"))
        return "Expense management application";

    if (modules.includes("Appointment Scheduling"))
        return "Clinic appointment management system";

    if (modules.includes("Student Management"))
        return "Student record management system";

    return "Software application";
}

module.exports = {
    generateProjectOverview
};