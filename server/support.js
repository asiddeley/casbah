/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const FS = require("fs")
//const FSP = require("FS-plus")
const PATH = require("path")

exports.addDays=function(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

exports.fileArrayLength=function(path){
	console.log("fileArrayLength:", path)
	var result=0
	try{
		var data=JSON.parse(FS.readFileSync(path))
		if (data instanceof Array){result=data.length} 
	}
	catch(e){console.log("error:",e)}
	return result
}

exports.fileKeyPlus1=function(file, key){
	var val=0
	try{
		console.log("try fileKeyPlus1:", file, key)
		var data=JSON.parse(FS.readFileSync(file))
		//assuming data is an Array
		val=data.pop()[key]+1 
	}
	catch(e){
		console.log("error:",e)
	}
	return val
}

exports.dirCountPlus=function(path, inc){
	inc=inc||0
	
	var folders=FS.readdirSync(path).filter(function (item) {
		return FS.statSync(PATH.join(path,file)).isDirectory()
	})

	return Number(folders.length+inc).toString().padStart(2,"0")
}

exports.getOwn=function(){
	var j={}
	for (var p in this){
		if (this.hasOwnProperty(p)) {
			j[p]=this[p]
		}
	}
	return j
}






