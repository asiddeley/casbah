/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")


var FieldLookup=function(typeDefo, field){
	/* returns the default value of a defined type or lookup function
	if value is not ready (ie. at the end of one or more links) */
	
	console.log("field lookup for ", field)
	this.typeDefo=typeDefo
	
	//this.td=td //eg {...definedType:defaultValue, drrHead:{...}, ...}
	//this.tv=tv //eg {drr:"undefined"}
	this.isArray=(field.indexOf("[")>=0)?true:false	
	//strip spaces and brackets to isolate name eg. [ DrrHead] -> DrrHead
	this.field=field.replace(" ","").replace("[","").replace("]","")
}

FieldLookup.prototype.fetch=function(){
	//td[name] finally set
	if (typeof this.typeDefo[this.field] == "undefined"){
		//value not yet defined so return this FieldLookup for another try later
		return this
	} else {
		//value defined to return it as a value or array of value depending on its TypeDefo definition
		if (this.isArray){
			return [this.typeDefo[this.field]]
		} else {
			return this.typeDefo[this.field]
		}
	}
}


///////////////////////////

var TypeLookup=function(typeDefo, name){
	this.typeDefo=typeDefo
	this.name=name
	this.fields={}
}

TypeLookup.prototype.store=function(field, valu){
	this.fields[field]=valu	
}


TypeLookup.prototype.fetch=function(){
	//try to resolve any fields that have a TypeLookup instead of a resolved value
	//returns true if all fields resolved, false if there is at least one TypdLookup on this pass
	var f, v, success=true
	for (f in this.fields){
		v=this.fields[f]
		if (v instanceof FieldLookup){
			//returns a value or a FieldLookup if value still undefined
			v=v.fetch()	
			this.fields[f]=v
			if (v instanceof FieldLookup){success=false}
		}		
	}
	return success
}


//////////////////////////////

TypeDefo=function(typo){
	
	//default typo structure
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
	//Store for user defined values extracted from Typo
	this.prop={}
	Object.assign(this.prop, typo.PROP)
	//data store and defaults for use by TypeLookup
	this.data={}
	this.data["String"]="abc"
	this.data["[String]"]=["abc"]
	this.data["Int"]=1
	this.data["[Int]"]=[1]
	this.data["Boolean"]=true
	this.data["[Boolean]"]=[true]

}

TypeDefo.prototype.stringify=function(type, typeLookup){

	if (typeof typeLookup != "object"){typeLookup=new TypeLookup()}
	var valu, field, data, retu="\n"
	for (var field in type){
		valu=type[field]			
		//Definition implied...
		//field=drrHead, valu={ARGS...}
		if (typeof valu == "string"){
			retu += field + ":String\n"
			this.store(field, valu)
			typeLookup.store(field, valu)
		} 
		else if (typeof valu == "number"){
			retu += field + (Number.isInteger(valu))?":Int\n":":Float\n"
			data={}; data[field]=valu
			this.store(field, valu)
			typeLookup.store(field, valu)
		} 
		else if (typeof valu == "boolean"){
			retu += field + ":Boolean\n"
			this.store(field, valu)
			typeLookup.store(field, valu)
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
				this.store(field, valu.DATA)
				typeLookup.store(field, valu.DATA)
			} else {
				/*
				infer data from type eg. graphql scalar or user defined type such as 'drrHead' but
				drrHead may not yet be defined if it comes later and it's data won't be available
				so defer the lookup
				valu.TYPE = 'String', '[String]' or 'drrHead' or '[drrHead]'
				*/
				if (typeof this.data[valu.TYPE]=="undefined"){
					typeLookup.store(field, new FieldLookup(this, valu.TYPE))					
				} else {				
					this.store(field, valu.TYPE)
				}
			}			
		}
	}		
	return retu
}

TypeDefo.prototype.store=function(field, valu){
	//what if name conflicts with other TD properties and methods?
	this.data[field]=valu
}

TypeDefo.prototype.mutationFields=function(){
	return this.stringify(this.typo.MTYPE)
}

TypeDefo.prototype.queryFields=function(){
	return this.stringify(this.typo.QTYPE)
}

TypeDefo.prototype.toTypeDefs=function(){
	
	//parse typeDefo (object) and convert to graphql TypeDefs (string) format

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
	var count=0, done=false, limit=(tll.length * tll.length), o, success=true 
	while (!done & (count < limit)) {
		//exits loop only when all tls are done 
		//should not loop more than array squared, problem if so
		//one false tl will make done false and keep while going
		done=true
		for (i in tll){
			tl=tll[i]
			success=tl.fetch()
			done = done && success
			if (success){
				//merge typeLookup value into typeDef (this) as a property for user  
				//tl.fields.drrHead={drrId:1, drrTitle:"hello"} -> typeDefs.drrHead
				o={} 
				o[tl.name]=tl.fields
				Object.assign(this.data, o) 				
			}			
		}
		count+=1
	}
	
	return retu
}

//////////////////////////////
//PUBLIC

exports.TypeDefo=TypeDefo
