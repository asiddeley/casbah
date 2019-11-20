/*****
CASBAH
Contract Administration System Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License
*****/


exports.background=['purple','beige', 'orange','orangered','cyan','royalblue','yellow','gold','green','olive','tan','brown','gray']
exports.foreground=['dark','light','light','light', 'light', 'dark', 'light', 'light', 'dark','dark','light','dark','dark']
exports.index=0
exports.names=["Alpha", "Bravo", 
	"Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet",
	"Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", 
	"Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"]
	
//functions don't seem to work accross different window instances... 
exports.nextName=function(){
	return this.names[this.index++]
}
exports.getName=function(){
	return this.names[this.index]
}
exports.getBackground=function(){
	return this.background[this.index]
}
exports.getForeground=function(){
	return this.foreground[this.index]
}

