/**********************************
CASBAH
Contract Admin Site Be Architectural Heroes
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
********************************/


///// IMPORTS
//const FSP=require('fs-plus')
//const PATH=require('path')
var remote = require('electron').remote
var windowManager = remote.require('electron-window-manager')
var ws=require('../electron/windowStatic.js')
var wsd=windowManager.sharedData.fetch('wsd')||ws.data
windowManager.sharedData.set('wsd', wsd)
var windowName=ws.getName(wsd)


//var GoogleSheet	= require('google-spreadsheet')	
//var gsProjects = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4")
//var secret = require('../private/client_secret.json')
//var {getOwn, cryptoId, addDays, LocalStore}=require("../electron/support.js")


var windowOptions={
	width: 1200,
	height: 400,
	//position: 'topLeft',
	position:[20, 20],
	resizable:true,
	showDevTools: true,
	frame:true,
	webPreferences: {nodeIntegration: true}
}

///// CA Docs
const CADOCS=[
	require('../electron/caProject.js').name,
	require('../electron/caSVR.js').name
]

///// EXPORTS
exports.ready=function(callback){
	
	new Vue({
		el:'#CASBAH',
		data:{
			caProject:true,
			caSVR:false,
			caCR:false,
			caDRR:false,
			caRFI:false,
		},
		computed:{
			//navbarStyle(){return {'background-color':wsd.backgrounds[wsd.index]}},
			//navbarType() {return wsd.foregrounds[wsd.index]}
			navbarStyle(){return {'background-color':ws.getBackground(wsd)}},
			navbarType() {return ws.getForeground(wsd)}
		},		
		methods:{
			switchTo(cadoc){
				for (var i in CADOCS){
					console.log('switchTo:', cadoc, i, CADOCS[i])
					//show cadoc requested else hide
					if (cadoc==CADOCS[i]){this[CADOCS[i]]=true}
					else {this[CADOCS[i]]=false}
				}				
			},		
			anotherWindow(){
				var file=`file://${__dirname}/casbah.html`
				//get latest window shared data
				wsd=windowManager.sharedData.fetch('wsd')
				var name=ws.nextName(wsd)
				//update shared data 
				windowManager.sharedData.set('wsd', wsd)
				ws.positionCascade(wsd, windowOptions, 20, 20)
				var anotherWindow=windowManager.createNew(name, name, file , false, windowOptions)
				anotherWindow.open()
			},
			onBeforeUnloaded(){
				ws.onBeforeUnloaded(wsd, windowName)
			}
		},
		mounted(){
			document.title=windowName		
		}
	})
	if (typeof callback=='function'){callback()}
} 

