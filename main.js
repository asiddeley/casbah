/**********************************
CASBAH* *Contract Admin Site Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/


const {app, BrowserWindow} = require('electron')
const EWM = require('electron-window-manager');
const PATH = require("path")
const FS = require('fs')
const FSP = require('fs-plus')

var jsonWS = '/private/browser-window-setups.json'
var jsonWSdef = '/electron/browser-window-setups.json'

var options={
	width: 600,
	height: 450,
	position: 'topLeft',
	layout: 'simple',
	resizable:true,
	showDevTools: true,
	frame:true,
	titleBarStyle:'hidden',
	webPreferences: {nodeIntegration: true}
}



console.log("jsonWS...", jsonWS) 

app.on('ready', function(){
	console.log("electron app ready...")
	//get browser window setups
	if (FSP.existsSync(PATH.join(__dirname,jsonWS))){
		console.log("Found Window setups...", jsonWS)
		//EWM.importList(jsonWS)
		EWM.open('home', 'Welcome...', `file://${__dirname}/electron/home.html`, false, options)
		//EWM.get('home').loadURL(`file://${__dirname}/offline/bootstrap.css`  )
	} else if (FSP.existsSync(PATH.join(__dirname,jsonWSdef))){
		console.log("Found Window default setups...", jsonWSdef)
		FS.copyFileSync(PATH.join(__dirname,jsonWSdef), PATH.join(__dirname,jsonWS))
		//EWM.importList(jsonWSdef)
		//EWM.get('Home').open();
		EWM.open('home', 'Welcome...', `file://${__dirname}/electron/home.html`, false, options)
		//EWM.get('home').loadURL(`file://${__dirname}/offline/bootstrap.css`  )
	}	

	//windowManager.init( ... );
	//EWM.open('home', 'Welcome ...', '/home.html');
})

/***

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
	titleBarStyle:'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('electron/home.html')
	//mainWindow.loadURL('https://github.com')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
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
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.





*/



