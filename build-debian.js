const { execSync } = require("child_process");
const { readdirSync } = require("fs");

// Dist debian versions
console.log ("Packaging debian versions");
execSync("electron-packager . RNGReporter --icon=Assets/icon.png --overwrite --ignore=.git,node_modules,.gitignore,package-lock.json --platform=linux --arch=all --out=dist-debian").toString();

// Build debian versions
const folderNames = readdirSync(`${__dirname}/dist-debian`);
for (const folderName of folderNames) {
    console.log(`Building debian ${folderName.split("-")[2]}. This may take a while`);
    execSync(`electron-installer-debian --src dist-debian/${folderName} --dest build-debian/${folderName} --icon Assets/icon.png --name RNGReporter --bin RNGReporter`);
}

console.log("All debian versions have been built");