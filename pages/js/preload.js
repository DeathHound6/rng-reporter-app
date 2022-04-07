const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('outgoing', {
    createWindow: (file) => {
        ipcRenderer.send('createWindow', file);
    },
    sendNotification: (title, body) => {
        ipcRenderer.send("sendNotification", title, body);
    },
    searchSeed: (gen) => {
        ipcRenderer.send("searchSeed", gen);
    }
});