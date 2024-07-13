import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    Execute: () => ipcRenderer.invoke('TDS:Execute')
})