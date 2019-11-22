/*****
CASBAH
Contract Administration System Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/

///// IMPORTS
//const FSP=require('fs-plus')
//const PATH=require('path')
//var remote = require('electron').remote
//var windowManager = remote.require('electron-window-manager')
const windowManager = require('electron-window-manager');

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

exports.open=function(){
	windowManager.open(
		names[exports.index++],
		names[exports.index],
		`file://${__dirname}/casbah.html`, 
		false, 
		windowOptions
	)
}




////////////////////////////
var windex=0
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

exports.backgrounds=colours
exports.foregrounds=foregrounds
exports.index=0
exports.names=names
exports.data={index:0, reloaded:[]}

exports.nextName=function(data){
	if (data.index<names.length){
		return names[data.index++]
	}
	else {
		return ('window-'+data.index.toString())		
	}
}

exports.getName=function(data){
	if (data.reloaded.length>0) {
		//means a window reload occured so return that window's name instead of assigning a new name
		return (data.reloaded.unshift())
	}
	else {
		//assign a new name from the list
		return names[data.index]
	}
}
exports.getBackground=function(data){
	//modulus operation ensures colours won't run out
	return colours[(data.index % colours.length)]
}
exports.getForeground=function(data){
	return foregrounds[data.index]
}

exports.onBeforeUnload=function(data, windowName){
	data.reloaded.push(windowName)
}

exports.positionCascade=function(data, options, dx, dy){
	var p=options.position
	options.position[0]=p[0]+data.index*dx
	options.position[1]=p[1]+data.index*dy	
	console.log('position:',options.position)
}



