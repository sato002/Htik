import { join } from 'path';
import {
    app,
    BrowserWindow,
    ipcMain,
    IpcMainInvokeEvent
} from 'electron';
import { ProfileService } from './service/ProfileService';

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        webPreferences: {
            preload: join(__dirname, './preload.js'),
        },
    });

    // and load the index.html of the app.
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');// Open the DevTools.

    } else {
        mainWindow.loadFile(join(__dirname, '../index.html'));
    }
    mainWindow.webContents.openDevTools();
    // mainWindow.loadURL( //this doesn't work on macOS in build and preview mode
    //     isDev ?
    //     'http://localhost:3000' :
    //     join(__dirname, '../../index.html')
    // );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // ipcMain Handle
    ipcMain.handle('TDS:Execute', TDSExecute)

    // create window
    createWindow()

    // app life cycle
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});



// private method
// event: IpcMainInvokeEvent, arg: string
async function TDSExecute() {
    var mainWorker = new ProfileService();
    mainWorker.create();
}
