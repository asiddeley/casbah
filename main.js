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


//const {app, BrowserWindow} = require('electron')
const APP=require('electron').app
const PATH=require('path')
//const windowManager = require('electron-window-manager');
const WME=require(PATH.join(__dirname, 'electron', 'windowManagerExtra.js'))



//const PATH = require("path")
//const FS = require('fs')
//const FSP = require('fs-plus')
/*
var windowOptions={
	width: 1200,
	height: 400,
	position: 'topLeft',
	resizable:true,
	showDevTools: true,
	frame:true,
	webPreferences: {nodeIntegration: true}
}
*/
APP.on('ready', function(){
	console.log("Electron app ready...")
	//windowManager.open('home', 'CASBAH', `file://${__dirname}/electron/casbah.html`, false, windowOptions)
	WME.open()	
})




