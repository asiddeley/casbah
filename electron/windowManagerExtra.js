/*****
CASBAH
Contract Administration System Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/

///// IMPORTS
const windowManager = require('electron-window-manager')

///// Module Scope Variables

var colours=[
	'purple','beige', 'orange','orangered','cyan','royalblue',
	'yellow','gold','green','olive','tan','brown','gray'
]
	
var foregrounds=[
	'dark','light','light','light', 'light', 'dark', 'light',
	'light', 'dark','dark','light','dark','dark'
]

var names=[
	"Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", 
	"Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", 
	"Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray",
	"Yankee", "Zulu"
]

var reloaded=[]

var windex=-1

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

///// Exports 
exports.open=function(){
	windex+=1
	windowManager.open(
		names[windex],
		names[windex], 
		`file://${__dirname}/casbah.html`, 
		false, 
		windowOptions
	)
}

exports.getWindowName=function(){
	if (reloaded.length>0) {
		//means a window reload occured so return that window's name instead of assigning a new name
		return (reloaded.unshift())
	}
	else {
		//assign a new name from the list
		return names[windex]
	}
}

exports.getBackground=function(name){
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

exports.nextName=function(){
	if (windex<names.length){
		return names[windex++]
	}
	else {
		return ('window-'+windex.toString())		
	}
}

exports.onBeforeUnload=function(windowName){
	reloaded.push(windowName)
}

exports.positionCascade=function(options, dx, dy){
	var p=options.position
	options.position[0]=p[0]+index*dx
	options.position[1]=p[1]+index*dy	
	console.log('position:',options.position)
}












