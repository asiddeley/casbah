/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const FS = require("fs")
//const FSP = require("FS-plus")
const PATH = require("path")
const CRYPTO = require('crypto')

exports.addDays=function(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

exports.cryptoId=function(item){
	return CRYPTO.randomBytes(10).toString('hex')
}

exports.dirCountPlus=function(path, inc){
	inc=inc||0
	
	var folders=FS.readdirSync(path).filter(function (item) {
		return FS.statSync(PATH.join(path,file)).isDirectory()
	})

	return Number(folders.length+inc).toString().padStart(2,"0")
}

exports.EXTEND=function(fn, fnSuperClass){
	/*****	
	Classical Single inheritance (constructor = superClass)
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
	*****/
	if ((typeof fn == "function")&&(typeof fnSuperClass == "function")){
		fn.prototype=Object.create(fnSuperClass.prototype)
		fn.prototype.constructor=fnSuperClass
	} else {
		throw("Error in EXTEND(fn, fnSuperClass), Both arguments must be functions.")
	}
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


exports.getOwn=function(){
	var j={}
	for (var p in this){
		if (this.hasOwnProperty(p)) {
			j[p]=this[p]
		}
	}
	return j
}




exports.MIXINS=function(){
	/*****	
	Multiple Inheritance or Mixins (constructor = subClass)
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
	*****/
	var subClass, mixin
	for (var i in arguments){
		if (i == 0){
			subClass=arguments[i]			
		} else {
			mixin=arguments[i]
			if (typeof mixin != "function"){
				throw("Error in MIXINS(), argument not a function.")
			}
			subClass.prototype=Object.assign(mixin.prototype)
			//fn.prototype.constructor=subClass
		}
	}
}






