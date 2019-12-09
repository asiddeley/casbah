/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
///// IMPORTS
const FS = require("fs")
const FSP = require("FS-plus")
const PATH = require("path")
const CRYPTO = require('crypto')




///// EXPORTS
exports.addDays=function(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


exports.getSamples=function(Fn, no){
	no=no||5
	var samples=[]
	for (var i=0; i<no; i++){
		//console.log('getSamples this:',this)
		samples[i]=new Fn({index:i})
	}
	return samples	
}	



exports.cryptoId=function(item){
	return CRYPTO.randomBytes(10).toString('hex')
}

/*
//DEPRECATED
exports.dirCountPlus=function(path, inc){
	inc=inc||0
	
	var folders=FS.readdirSync(path).filter(function (item) {
		return FS.statSync(PATH.join(path,file)).isDirectory()
	})

	return Number(folders.length+inc).toString().padStart(2,"0")
}
*/
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

/*
// DEPRECATED
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
*/

exports.getOwn=function(){
	var j={}
	for (var p in this){
		if (this.hasOwnProperty(p)) {
			j[p]=this[p]
		}
	}
	return j
}


exports.LocalStore=function(path, defaultContent, defaultContentRules){
	if (arguments.length < 3){
		throw('LocalStore requires 3 arguments')
	}
	content=defaultContent||{}
	try { 
		if(!defaultContentRules) {content = require(path)}
	}
	catch(err){
		//console.log('Error reading JSON from (path):', path)
	}	
	Object.assign(this, content)
	//console.log('localStore:',this)
	this.stringify=function(){return JSON.stringify(this)}
	this.set=function(name, val){
		if (name && val){this[name]=val}
		try {FSP.writeFileSync(path, this.stringify())}
		catch(err){
			console.log('Error saving JSON to (path): ', path)
		}
	}
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

exports.Note=function(item, note, extra){
	this.item=item||'1.1'
	this.note=note||'note'
	this.extra=extra||'--'	
	this.type=""
}



exports.pivot=function(row, keyName, valName){
	//map an object representing a row eg. {key1:val1, key2, val2...} 
	//to an array of key, val pairs eg. [{keyName:key1, valName:val1}, {keyName:key2, valName:val2}...}

	if (arguments.length<3){throw('pivot function requires min 3 arguments')}
	row=row||{Item1:'undefined', item2:'undefined'}
	keyName=keyName||'Heading'
	valName=valName||'Content'
	
	var table=Object.keys(row).map(function(k){
		var o={}
		o[keyName]=k
		o[valName]=row[k]
		return o
	})
	return table
}

exports.pivotBack=function(rows, keyName, valName){
	//reverse operation as pivot
	
	if (arguments.length<3){throw('pivot function requires min 3 arguments')}
	keyName=keyName||'Heading'
	valName=valName||'Content'
	rows=rows||[{keyName:'undefined', valName:'undefined'}]
	
	var result={}
	rows.forEach(function(row){
		result[row[keyName]]=row[valName]}
	)
	return result
}
		


exports.showAtPointer=function(menu, e) {
	var wx=window.innerWidth, wy=window.innerHeight, sx=window.scrollX, sy=window.scrollY
	menu.$el.style.display = 'block'
	//var mx=menu.clientWidth, my=menu.clientHeight
	var mx=menu.$el.scrollWidth, my=menu.$el.scrollHeight
	menu.$el.style.left=((e.pageX + mx > wx && mx < e.pageX)?e.pageX+sx-mx:e.pageX+sx )+'px'
	menu.$el.style.top=((e.pageY + my > wy && my < e.pageY)?e.pageY+sy-my:e.pageY+sy)+'px'
}

