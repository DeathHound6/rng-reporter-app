const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('outgoing', {
    createWindow: (file) => {
        ipcRenderer.send('createWindow', file);
    },
    sendNotification: (title, body) => {
        ipcRenderer.send("sendNotification", title, body);
    },
    searchSeed: (info) => {
        return ipcRenderer.invoke("searchSeed", info);
    },
    loadFile: (filename) => {
        return ipcRenderer.invoke("loadFile", filename);
    },
    saveFile: (filename, data) => {
        ipcRenderer.send("saveFile", filename, data);
    }
});