const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

app.isPackaged || require('electron-reloader')(module)

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, 'preload.js')
      },
      frame: false,
    })
    win.loadFile('index.html')
    win.setMenuBarVisibility(false)
    win.maximize()

    let maximizeToggle = false

    ipcMain.on("manualMinimize", () => {
      win.minimize()
    });

    ipcMain.on("manualMaximize", () => {
      if (maximizeToggle) {
        win.unmaximize()
      } else {
        win.maximize()
      }
      maximizeToggle= !maximizeToggle;
    });


    ipcMain.on("manualClose", () => {
      win.close()
    }); 

    win.webContents.openDevTools()
  }
 

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
    
  })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

