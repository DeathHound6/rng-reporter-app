const { execSync } = require("child_process");
const { readdirSync } = require("fs");

// Dist windows versions
console.log ("Packaging windows versions");
execSync("electron-packager . RNGReporter --icon=Assets/icon.ico --overwrite --ignore=.git,node_modules,.gitignore,package-lock.json --platform=win32 --arch=all --out=dist-windows").toString();

// Build windows versions
const folderNames = readdirSync(`${__dirname}/dist-windows`);
for (const folderName of folderNames) {
    console.log(`Building win32 ${folderName.split("-")[2]}. This may take a while`);
    execSync(`electron-installer-windows --src dist-windows/${folderName} --dest build-windows/${folderName} --icon Assets/icon.ico --name RNGReporter --exe RNGReporter.exe`);
}

console.log("All windows versions have been built");