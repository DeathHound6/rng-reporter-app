const { app, BrowserWindow, Notification, dialog, ipcMain } = require("electron");
const ejse = require("ejs-electron");
const { execSync, exec } = require("child_process");
const { existsSync, writeFileSync } = require("fs");
let lastFile = null;

const createWindow = (file) => {
    for (const win of BrowserWindow.getAllWindows()) {
        win.close();
    }
    const win = new BrowserWindow({
        resizable: false,
        movable: true,
        title: "RNG Reporter",
        icon: process.platform == "win32" ? `${__dirname}/Assets/icon.ico` : `${__dirname}/Assets/icon.png`,
        autoHideMenuBar: true,
        webPreferences: {
            devTools: process.env.NODE_ENV != "production",
            preload: `${__dirname}/pages/js/preload.js`
        }
    });
    win.loadFile(`pages/${file}`);
    ejse.data("win", win);
    lastFile = file;
};

app.whenReady().then(() => {
    try {
        app.setName("RNG Reporter");
        const searcherVersion = execSync("rng-reporter-searcher -v").toString();
        ejse.data("searcherVersion", searcherVersion.split(" ")[searcherVersion.split(" ").length - 1]);
        ejse.data("appVersion", require("./package.json").version);
        createWindow("index.ejs");
        
        // Send specific requests from frontend
        ipcMain.on("sendNotification", (event, title, body) => {
            sendNotification(title, body);
        });
        ipcMain.on("createWindow", (event, file) => {
            createWindow(file);
        });
        ipcMain.handle("searchSeed", (event, info) => {
            searchSeed(info);
        });
        ipcMain.handle("loadFile", (event, filename) => {
            return LoadFile(filename);
        });
        ipcMain.on("saveFile", (event, filename, data) => {
            SaveFile(filename, data);
        });

        // Start auto updater when ready
        require("update-electron-app")({
            updateInterval: "2 hours",
            notifyUser: true,
            repo: "DeathHound6/rng-reporter-app"
        });
    } catch (e) {
        dialog.showMessageBox(BrowserWindow.getAllWindows()[0], {
            type: "error",
            buttons: ["Ok"],
            title: "Missing Searcher",
            detail: "The searcher application seems to be missing. Ensure that the searcher executable is in this folder, or is located in the PATH environment variable"
        }).then(app.quit);
    }
});

app.on("window-all-closed", (event) => {
    event.preventDefault();
    dialog.showMessageBox(BrowserWindow.getAllWindows()[0], 
    { type: "question", 
        buttons: ["Yes", "No"], 
        title: "Exit?", 
        detail: "Are you sure you want to exit?" 
    }).then(res => {
        if (res.response == 0) app.quit();
        else createWindow(lastFile);
    });
});

function sendNotification(title, body) {
    new Notification({ 
        title, 
        body, 
        icon: process.platform == "win32" ? `${__dirname}/Assets/icon.ico` : `${__dirname}/Assets/icon.png` 
    }).show();
}

function searchSeed(info) {
    exec(`rng-reporter-searcher --g${info.gen} --${info.DPPt?"dppt":"hgss"} --months ${info.months} --delay ${info.delay} --seconds ${info.seconds} --days ${info.days} --hours ${info.hours} --minutes ${info.minutes} --tid ${info.tid} --sid ${info.sid}`,
      (err, response, stderr) => {
        if (err || stderr)
            return dialog.showErrorBox("Error", err?.toString() || stderr);
        sendNotification("Seed Search", "The seed search has finished");
        dialog.showMessageBox(BrowserWindow.getAllWindows()[0], {
            type: "info",
            title: "Search Results",
            detail: response,
            buttons: ["OK"]
        });
    });
}

function LoadFile(filename) {
    if (!filename.endsWith(".json")) 
        filename = filename.trim() + ".json";
    if (!existsSync(filename))
        return dialog.showErrorBox("Error", `File '${filename}' does not exist`);
    return require(`./${filename}`);
}

function SaveFile(filename, data) {
    if (!filename.endsWith(".json")) 
        filename = filename.trim() + ".json";
    writeFileSync(filename, JSON.stringify(data, null, 4));
    dialog.showMessageBox(BrowserWindow.getAllWindows()[0], {
        type: "info",
        title: "Saved",
        detail: `Saved to '${filename}'`,
        buttons: ["OK"]
    });
    // Make file backups
    let x = 1;
    while (existsSync(`${filename.split(".")[0]}_BACKUP${x}.json`))
        x += 1;
    filename = `${filename.split(".")[0]}_BACKUP${x}.json`;
    writeFileSync(filename, JSON.stringify(data, null, 4));
}
