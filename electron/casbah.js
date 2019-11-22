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
var remote = require('electron').remote
var wm = remote.require(PATH.join(__dirname,'windowManagerExtra.js'))
var windowName=wm.getWindowName()


//var GoogleSheet	= require('google-spreadsheet')	
//var gsProjects = new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4")
//var secret = require('../private/client_secret.json')
//var {getOwn, cryptoId, addDays, LocalStore}=require("../electron/support.js")


///// CA Modules or Document Types
const caMods=[
	require('../electron/caProject.js'),
	require('../electron/caSVR.js'),
	require('../electron/caDrr.js')
]

//component visibility properties eg. caProject:true, caSVR:false
function propsForShow(caMods){
	var d={}, firstOne=true
	for (var i in caMods){
		d[caMods[i].name]=firstOne?true:false
		firstOne=false
	}
	return d
}

//titles or hover popups eg. caPtojectTitle:'verbage...' <n-dd-item :title='caProjectTitle'>
function propsForTitle(caMods){	
	var d={}
	for (var i in caMods){d[caMods[i].name+'Title']=caMods[i].title}
	return d
}

///// EXPORTS
exports.ready=function(callback){
	
	new Vue({
		el:'#CASBAH',
		data:Object.assign(
			propsForShow(caMods), 
			propsForTitle(caMods)	
		),
		computed:{
			navbarStyle(){return {'background-color':wm.getBackground(windowName)}},
			navbarType() {return wm.getForeground(windowName)}
		},		
		methods:{
			switchTo(caMod){
				//show cadoc requested else hide
				for (var i in caMods){
					if (caMod==caMods[i].name){this[caMods[i].name]=true}
					else {this[caMods[i].name]=false}
				}				
			},		
			anotherWindow(){wm.open()},
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

