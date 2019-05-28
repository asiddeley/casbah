/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")


var FieldLookup=function(field){
	/* returns the default value of a defined type or lookup function
	if value is not ready (ie. at the end of one or more links) */
	
	console.log("field lookup for ", field)
	//dll.push(this)
	
	this.td=td //eg {...definedType:defaultValue, drrHead:{...}, ...}
	this.tv=tv //eg {drr:"undefined"}
	this.isArray=(name.indexOf("[")>=0)?true:false	
	//strip and isolate name eg. [DrrHead] -> DrrHead
	this.type=type.replace("[","").replace("]","")
}

FieldLookup.prototype.getFieldValue=function(){
	//td[name] finally set
	(if typeof this.td[this.type] != "undefined"){
		tv[this.type]=this.td[this.type]
		dll
	}
	return
}


///////////////////////////

var TypeLookup=function(){
	this.fields={}
	//true when all fields are resolved to values (ie. no instanceOf TypeLookup functions)
	this.done=false
}

TypeLookup.prototype.storeFieldValue=function(field, Valu){
	this.fields[field]=valu
	
}

TypeLookup.prototype.getFieldValues=function(){
	//returns the value of the field or itself (instanceOf TypeLookup Object) if field value not ready


	return this.done
}

//////////////////////////////

TD=function(typo){
	//validate
	this.typo={
		//graphql enum definitions
		ENUM:{},
		//graphql mutation fields (for extending type mutation{...} )
		MTYPE:{},
		//graphql input
		INPUT:{},
		//misc properties for use by resolvers
		PROP:{},	
		//graphql query fields
		QTYPE:{},
		//graphql types
		TYPE:{}
	}	
	Object.assign(this.typo, typo)
	Object.assign(this, typo.PROP)
	
	//default properties for typeLookup
	this["String"]="abc"
	this["Int"]=1
	this["Boolean"]=true
}

TD.prototype.stringify=function(type, typeLookup){
	var td=this
	if (typeof typeLookup != "object"){typeLookup=new TypeLookup()}
	var valu, field, data, retu="\n"
	for (var field in type){
		valu=type[field]			
		//Definition implied...
		//field=drrHead, valu={ARGS...}
		if (typeof valu == "string"){
			retu += field + ":String\n"
			td.storeFieldValue(field, valu)
			typeLookup.storeFieldValue(field, valu)
		} 
		else if (typeof valu == "number"){
			retu += field + (Number.isInteger(valu))?":Int\n":":Float\n"
			data={}; data[field]=valu
			td.storeFieldValue(field, valu)
			typeLookup.storeFieldValue(field, valu)
		} 
		else if (typeof valu == "boolean"){
			retu += field + ":Boolean\n"
			td.storeFieldValue(field, valu)
			typeLookup.storeFieldValue(field, valu)
		} 			
		//Definition explicitly defined in object...
		else if (typeof valu == "object"){
			retu += field
			if (typeof valu.ARG != "undefined" && valu.ARG instanceof Array){
				retu += "(" + valu.ARG.join(", ") + ")"
			}
			if (typeof valu.TYPE == "string"){
				retu += ":" + valu.TYPE + "\n"
			} else {
				throw "Error, definition missing 'TYPE' for " + field 
			}
			if (typeof valu.DATA != "undefined"){
				td.storeFieldValue(field, valu.DATA)
				typeLookup.storeFieldValue(field, valu.DATA)
			} else {
				/*
				infer data from type eg. graphql scalar or user defined type such as 'drrHead' but
				drrHead may not yet be defined if it comes later and it's data won't be available
				so defer the lookup
				valu.TYPE = 'String', '[String]' or 'drrHead' or '[drrHead]'
				*/
				if (typeof td[valu.TYPE]=="undefined"){
					typeLookup.storeFieldValue(field, new FieldLookup(valu.TYPE))					
				} else {				
					td.storeFieldValue(field, valu.TYPE)
				}
			}			
		}
	}		
	return retu
}

TD.prototype.storeFieldValue=function(field, valu){
	//what if name conflicts with other TD properties and methods?
	this[field]=valu
}

TD.prototype.mutationFields=function(){
	return this.stringify(this.typo.MTYPE)
}

TD.prototype.queryFields=function(){
	return this.stringify(this.typo.QTYPE)
}

TD.prototype.typeDefs=function(){
	var typeDefs=this
	//parse typeDefs formatted as object and convert to graphql string format
	var name, retu="", i, tl, tll=[]
	
	for (name in this.typo.TYPE){
		tl=new TypeLookup(name); tll.push(tl)
		retu += "type " + name + " {\n" + this.stringify(this.typo.TYPE[name], tl) +"\n}\n"
	}	
	
	for (name in this.typo.INPUT){
		tl=new TypeLookup(name); tll.push(tl)
		retu += "input " + name + " {\n" + this.stringify(this.typo.INPUT[name], tl) +"\n}\n"
	}
	
	for (name in this.typo.ENUM){
		tl=new TypeLookup(name); tll.push(tl)
		retu += "enum " + name + " {\n" + this.stringify(this.typo.INPUT[name], tl) +"\n}\n"
	}	

	//resolve typeLookups and merge values into this TD
	var count=0, done=false, limit=(tll.length * tll.length)
	while(!done && (count < limit)){
		//exits loop only when all tls are done 
		//should not loop more than array squared, problem if so
		//one false tl will make done false and keep while going
		done=true
		for (i in tll){
			tl=tll[i]
			tl.getFieldValues()
			done = done && tl.done
			if (tl.done){
				//merge typeLookup value into typeDef (this) as a property for user  
				//tl.fields.drrHead={drrId:1, drrTitle:"hello"} -> typeDefs.drrHead
				tl.mergeFieldValues(typeDefs) 				
			}			
		}
		count+=1
	}
	
	return retu
}

//////////////////////////////
//PUBLIC

exports.TypeDefs=TD
