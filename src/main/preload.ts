import { contextBridge, ipcRenderer } from "electron";
import { Profile } from "./model/Profile";

contextBridge.exposeInMainWorld('electron', {
    execute: () => ipcRenderer.invoke('TDS:Execute'),
    createProfile: (profile: Profile) => ipcRenderer.invoke('ipcMain:createProfile', profile),
    getAllProfiles: () => ipcRenderer.invoke('ipcMain:getAllProfiles')
})