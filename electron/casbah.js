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
const PATH=require('path')
const REMOTE = require('electron').remote
const WM = REMOTE.require(PATH.join(__dirname,'windowManagerExtra.js'))

const CAMODS=[
	require('../electron/caProject.js'),
	require('../electron/caSvr.js'),
	require('../electron/caDrr.js')
]

///// MODULE SCOPE
//var nodeConsole = require('console');
//var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
//myConsole.log('Hello World!');

var reloaded=WM.getReloaded()
//console.log('RELOADED:', reloaded)

//var windowName=WM.getWindowName()
var windowName=WM.getCurrent().name
//console.log('CURRENT WIN:', windowName)


window.addEventListener('beforeunload', function(e){
	//reload or window close may have been called
	WM.onBeforeUnload(windowName)
})

window.addEventListener('close', function(e){
	//window close definately called
	WM.onClose(windowName)
	e.preventDefault()
	return false
}, false)	

//var GoogleSheet	= require('google-spreadsheet')	
//var gsProjects = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4")
//var secret = require('../private/client_secret.json')
//var {getOwn, cryptoId, addDays, LocalStore}=require("../electron/support.js")




//component visibility properties eg. vm.caProject:true, caSVR:false
function propsForShow(){
	var d={}, firstOne=true
	for (var i in CAMODS){
		d[CAMODS[i].name]=firstOne?true:false
		firstOne=false
	}
	return d
}

//component title properties eg. vm.caProjectTitle:'Ca Project Log' <n-dd-item :title='caProjectTitle'>
function propsForTitle(){	
	var d={}
	for (var i in CAMODS){d[CAMODS[i].name+'Title']=CAMODS[i].title}
	return d
}





///// EXPORTS
exports.ready=function(callback){
	
	new Vue({
		el:'#CASBAH',
		data:Object.assign(
			propsForShow(), 
			propsForTitle()	
		),
		computed:{
			//navbarStyle is deprecated
			//navbarStyle(){return {'background-color':WM.getColour(windowName)}},
			navbarClass() {return windowName},
			navbarType() {return WM.getForeground(windowName)}
		},
		methods:{
			switchTo(caMod){
				//show requested component and hide the rest
				for (var i in CAMODS){
					if (caMod==CAMODS[i].name){this[CAMODS[i].name]=true}
					else {this[CAMODS[i].name]=false}
				}				
			},		
			anotherWindow(){
				//windowName is optional, means new window will be cascaded from current
				WM.open(windowName)
			}		
		},
		mounted(){
			//document.title=windowName	
		}
	})
	if (typeof callback=='function'){callback()}
} 


