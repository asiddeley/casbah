/*****
CASBAH
Contract Administration System Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/

///// IMPORTS
const windowManager = require('electron-window-manager')

///// Module Scope Variables

//holds name of window that was closed
var closed=[]

//deprecated, use <.. :class=windowName> instead
var colours=[
	'purple',
	'white', 'orange', 'orange', 'blue', 'blue', 'gold',
	'gold', 'green', 'green', 'brown', 'brown', 'black',
	'black', 'black', 'black', 'black', 'black', 'purple',
	'purple', 'purple',	'purple', 'purple',	'purple', 'black',
	'black'
]

var foregrounds=[
	'dark',
	'light','light','light', 'dark', 'dark', 'light',
	'light','dark','dark','dark','dark', 'dark',
	'dark','dark','dark','dark','dark', 'dark',
	'light','light','light','light','light', 'light',
	'dark'
]

var names=[
	"Alpha", 
	"Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", 
	"Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", 
	"November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", 
	"Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", 
	"Zulu"
]

var options={
	width: 1200,
	height: 400,
	//position: 'topLeft',
	position:[20, 20],
	resizable:true,
	showDevTools:true,
	frame:true,
	webPreferences: {nodeIntegration: true}
}
var prefix='CA'
var positionDelta=[20,20]

//names of windows to reuse beacuse of refresh or closed
var reuse=[]

var windex=-1

function getNextWindowName(){
	//if (reuse.length>0) {
		//means a window reload occured so return that window's name instead of assigning a new name
		//return reuse.shift()
	//}
	//else {
		//assign a new name from the list
		windex+=1
		if(windex<names.length){return names[windex]}
		else{return ( prefix + windex.toString() ) }
	//}
}

//DEPRECATED use getCurrent().name instead
function getWindowName(){
	if (reuse.length>0) {
		//means a window reload occured so return that window's name instead of assigning a new name
		return reuse.shift()
	}
	else {
		//assign a new name from the list
		if(windex<names.length){return names[windex]}
		else{return ( prefix + windex.toString() ) }
	}
}

///// Exports 
exports.get=function(name){return windowManager.get(name)}

//exports.getWindowName=getWindowName
exports.getCurrent=function(){return windowManager.getCurrent()}

//deprecated, use class instead 
exports.getColour=function(name){
	var i=names.indexOf(name)
	//modulus operation ensures colours won't run out
	if (i!=-1){ return colours[(i % colours.length)]}
	else { return colours[0] }
}

exports.getForeground=function(name){
	var i=names.indexOf(name)
	if (i!=-1){ return foregrounds[(i % foregrounds.length)] }
	else { return foregrounds[0] }
}

exports.getReloaded=function(){	
	return Object.create({reuse:reuse, closed:closed})
}

//exports.getNextName=getNextName

exports.onBeforeUnload=function(windowName){
	reuse.push(windowName)
}

//window onClose event listener not working
exports.onClose=function(windowName){
	closed.push(windowName)
}

exports.open=function(callingWindowName){
	
	if (callingWindowName){
		//Cascade new window from callingWindowName
		var win=windowManager.get(callingWindowName)
		//console.info('Caller properties:', win)
		var pos=win.object.getPosition().map(function(v, i){
			return v+positionDelta[i]
		})
	}
	var name=getNextWindowName()
	var html=`file://${__dirname}/casbah.html`

	if (names.includes(name)){
		windowManager.open(name, name, html, false, Object.assign(options,{position:pos}))
		return true
	} else {return 'CASBAH window limit reached.'}
	
}











