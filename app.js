const {app, BrowserWindow, Menu, Tray} = require('electron')
const path = require('path')
const RPC = require('./rpc')

function createWindow () {
    
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 450,
        icon: './icon.png',
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: false
    })
    
    mainWindow.on('minimize',function(event){
        event.preventDefault();
        mainWindow.hide();
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    var appIcon = null;
    appIcon = new Tray('./icon.png');
    var contextMenu = Menu.buildFromTemplate([
        { label: 'Show App', click:  function(){
            mainWindow.show();
        } },
        { label: 'Quit', click:  function(){
            application.isQuiting = true;
            application.quit();
        } }
    ]);
    appIcon.on("click",()=>{
        mainWindow.show();
    })
    appIcon.setToolTip('Pluralkit RPC');
    appIcon.setContextMenu(contextMenu);
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    }
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
// On macOS it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
