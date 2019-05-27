/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")

//defferedLookup List
var dll=[]
var DeferedLookup=function(td, tv, type){
	/* returns the default value of a defined type or lookup function
	if value is not ready (ie. at the end of one or more links) */
	
	console.log("deferred lookup for ", type)
	dll.push(this)
	
	this.td=td //eg {...definedType:defaultValue, drrHead:{...}, ...}
	this.tv=tv //eg {drr:"undefined"}
	this.isArray=(name.indexOf("[")>=0)?true:false	
	//strip and isolate name eg. [DrrHead] -> DrrHead
	this.type=type.replace("[","").replace("]","")


	this.lookup=function(){
		//td[name] finally set
		(if typeof this.td[this.type] != "undefined"){
			tv[this.type]=this.td[this.type]
			dll
		}
	}
}



TD=function(typo){
	//validate
	this.typo={
		//graphql enum definitions
		ENUMS:{},
		//graphql mutation fields (for extending type mutation{...} )
		MTYPE:{},
		//graphql input
		INPUT:{},
		//misc properties for use by resolvers
		PROPS:{},	
		//graphql query fields
		QTYPE:{},
		//graphql types
		TYPE:{}
	}	
	Object.assign(this.typo, typo)
	Object.assign(this, typo.PROPS)
}

TD.prototype.stringify=function(type, tv){

	if (typeof tv != "object"){tv={}}
	var valu, name, data, retu="\n"
	for (var name in type){
		valu=type[name]			
		//Definition implied...
		//name=drrHead, valu={ARGS...}
		if (typeof valu == "string"){
			retu += name + ":String\n"
			//keep valu as initial valu for database
			data={}; data[name]=valu
			//data saved twice, as individual value and 
			Object.assign(this, data)
			//as part of its parent type in case summary of parent is requested
			Object.assign(tv, data)
		} 
		else if (typeof valu == "number"){
			retu += name + (Number.isInteger(valu))?":Int\n":":Float\n"
			data={}; data[name]=valu
			Object.assign(this, data)
			Object.assign(tv, data)
		} 
		else if (typeof valu == "boolean"){
			retu += name + ":Boolean\n"
			data={}; data[name]=valu
			Object.assign(this, data)
			Object.assign(tv, data)
		} 			
		//Definition explicitly defined in object...
		else if (typeof valu == "object"){
			retu += name
			if (typeof valu.ARGS != "undefined" && valu.ARGS instanceof Array){
				retu += "(" + valu.ARGS.join(", ") + ")"
			}
			if (typeof valu.TYPE == "string"){
				retu += ":" + valu.TYPE + "\n"
			} else {
				throw "Error, definition missing 'TYPE' for " + name 
			}
			if (typeof valu.DATA != "undefined"){
				//get data as explicitly defined 
				data={}; data[name]=valu.DATA
				//expose it as a TD object property (eg. for use in graphql resolver function)
				Object.assign(this, data)
				//and include it in it's parent object (eg. drrId:"aaa-111" inside drrHead:{}   )
				Object.assign(tv, data)
			} else {
				/*infer data from type eg. graphql scalar or user defined type such as 'drrHead' but
				drrHead may not yet be defined if it comes later and it's data won't be available
				so defer the lookup*/
				new DeferredLookup(this, tv, valu.TYPE)
			}			
		}
	}		
	return retu
}

TD.prototype.mutationFields=function(){
	return this.stringify(this.typo.MTYPE)
}

TD.prototype.queryFields=function(){
	return this.stringify(this.typo.QTYPE)
}

TD.prototype.typeDefs=function(){
	var name, retu="", tv
	for (name in this.typo.TYPE){
		tv={}
		retu += "type " + name + " {\n" + this.stringify(this.typo.TYPE[name], tv) +"\n}\n"
		//expose the type-valu (tv) ie. default data
		Object.assign(this, tv)
	}	
	
	for (name in this.typo.INPUT){
		tv={}
		retu += "input " + name + " {\n" + this.stringify(this.typo.INPUT[name], tv) +"\n}\n"
		Object.assign(this, tv)
	}
	
	return retu
}
//PUBLIC

exports.TypeDefs=TD
