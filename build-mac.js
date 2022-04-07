const { execSync } = require("child_process");
const { readdirSync } = require("fs");

// Dist mac versions
console.log ("Packaging mac versions");
execSync("electron-packager . RNGReporter --icon=Assets/icon.ico --overwrite --ignore=.git,node_modules,.gitignore,package-lock.json --platform=mas --arch=all --out=dist-mac").toString();

// Build mac versions
const folderNames = readdirSync(`${__dirname}/dist-mac`);
for (const folderName of folderNames) {
    console.log(`Building mac ${folderName.split("-")[2]}. This may take a while`);
    execSync(`electron-installer-dmg dist-mac/RNGReporter.app RNGReporter --icon=Assets/icon.ico --overwrite --out=build-mac/${folderName}`);
}

console.log("All mac versions have been built");