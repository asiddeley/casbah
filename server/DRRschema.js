/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const FS = require("fs")
const FSP = require("fs-plus")
const PATH = require("path")
const PROJECT = require("projectSchema").current
const CRYPTO = require('crypto')

//console codes
const BLUE="\x1b[34m", RESET="\x1b[0m"

//DRR folders and files 
const BRANCH=PATH.join("reports", "deficiency reviews")
const CASITE=PATH.join(global.appRoot, global.casite)
const FILENAME_HEAD="head.json"
const FILENAME_NOTES="notes.json"
const FILENAME_DEFICS="deficiencies.json"
const FILENAME_PLANS="plans.json"
const FILENAME_PHOTOS="photos.json"
const FOLDER_PLANS="plans"
const FOLDER_PHOTOS="photos"

////////////////////
// support functions
const {addDays, dirCountPlus, getOwn} = require(path.join(__dirname,"support"))

const EXTEND=function(fn, fnSuperClass){
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

const MIXINS=function(){
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
			fn.prototype.constructor=subClass
		}
	}
}

function cryptoId(item){
	return CRYPTO.randomBytes(10).toString('hex')
}


///////////////////////////////////////////////
// DBonFS (data-base on file system) prototypes: jsonFiler, txtFiler, uploadBucket, 

// jsonFiler
function jsonFiler(path){
	//initialize
	path=path||this.path
	if (FSP.existsSync(path){
		this.deserialize(path)	
	} else {
		FS.mkdirSync(PATH.dirname(path))
		this.serialize(path)	
	}	
}

jsonFiler.prototype.deserialize=function(path){
	try {
		path=path||this.path
		console.log("trying " + this.constructor.name + ".deserialize...")
		Object.assign(this,	JSON.parse(FS.readFileSync(path)))
	} catch(e) {
		console.log("error:", e, "/////////////////////////////")
	}
}

jsonFiler.prototype.getData=function(){
	//returns own properties of parent object
	var j={}
	for (var p in this){
		if (this.hasOwnProperty(p)) {
			j[p]=this[p]
		}
	}
	return j
}

jsonFiler.prototype.serialize=function(path){
	try {
		path=path||this.path
		console.log("trying " + this.constructor.name + ".serialize...")
		FS.writeFileSync(path, JSON.stringify(this.getData()))
	} catch(e) {
		console.log("error:", e, "/////////////////////////////")
	}	
}

// imageFiler
function imageFiler(dir, list){
	// initialize
	dir=dir||this.dir
	// [{image:"imgName", caption:"caption"...}, {info2}...]
	list=list||[{}]
	// image extensions to look for
	const EXTS=["JPG", "PNG"]
	// update list with info on images in dir...
	var images
	if (FSP.existsSync(dir){
		// image folder exists so proceed...
		images=FS.readdirSync(dir).filter(function (file) {
			return (
				FS.statSync(PATH.join(dir, file)).isFile() &&
				EXTS.includes(file.split(".").pop().toUpperCase())
			)
		})
		images.forEach(function(file){
			// search list for info on {image:file}
			if (!list.find(function(i){return i.image==file})){
				var stats=FS.statSync(PATH.join(dir, file))
				list.push({
					//remove the extension
 					caption:file.split(".")[0], 
					//date:atime, //accessed
					//date:ctime, //status changed
					//date:mtime, //modified
					date:stats.birthtime.toString().substring(0,15),
					image:file,					
					photoId:cryptoId(file)
				})
			}
		})
	} else {
		// image folder not found so create it
		// this.serialize(dir)	
	}
}


//////////////////////////////////////////////////
// export graphql Schema Definition Language (SDL)


exports.mutationFields=`
	drrCreate(projectId:String!, drrId:String!):Drr
	drrHeadUpdate(projectId:String!, drrId:String!, drrHeadInput:DrrHeadInput!):Drr
`

exports.queryFields=` 
	drrIds(projectId:String!):[String]
	drr(projectId:String!, drrId:String!):Drr
`

//Drr data structure & default values
exports.typeDefs=` 
type Drr {
	drrHead(projectId:String!, drrId:String!):DrrHead
	drrNotes(projectId:String!, drrId:String!):DrrNotes
	drrPlans(projectId:String!, drrId:String!):[DrrPlan]
	deficiencies(projectId:String!, drrId:String!):[Deficiency]
	drrPhotos(projectId:String!, drrId:String!):[DrrPhoto]
}`

function Drr(projectId, drrId){
	//implements graphQL {typeDefs(), queryFields(), mutationFields(), resolvers()} 
	//implements serialize(), deserialize()

	//check projectId or else get project number from handler
	projectId=projectId||PROJECT.current.projectId

	//ensure DRR folder exists
	FSP.makeTreeSync(PATH.join(CASITE, projectId, BRANCH))

	//check drrId - create new drrId based on folder count
	drrId=drrId||("DRR-A"+dirCountPlus(PATH.join(CASITE, projectId, BRANCH), 1))

	//questionable because projectId and drrId might change
	//this.home=PATH.join(CASITE, projectId, BRANCH, drrId) 

	//graphQL properties or graphQLables
	this.head=new DrrHead(projectId, drrId)
	this.notes=new DrrNotes(projectId, drrId)
	this.deficiencies=new Deficiencies(projectId, drrId)
	this.plans=new DrrPlans(projectId, drrId)
	this.photos=new DrrPhoto(projectId, drrId)
}

Drr.prototype.getData=function(){
	return {
		head:this.head.getData(),
		notes:this.notes.getData(),
		plans:this.plans.getData(),
		deficinecies:this.deficiencies.getData(),
		photos:this.photos.getData()
	}	
}

Drr.prototype.deserialize=function(){
	this.head.deserialize()
	this.notes.deserialize()
	this.plans.deserialize()
	this.deficiencies.deserialize()
	this.photos.deserialize()
}

Drr.prototype.serialize=function(){
	this.head.serialize()
	this.notes.serialize()
	this.plans.serialize()
	this.deficiencies.serialize()
	this.photos.serialize()
}

/********************
// EXPERIMENTAL graphQLable methods

Drr.prototype.mutationFields=function(){
	//returns a consolidated string of graphql mutation fields for Drr and its properties
	return (
		"drrMutate(projectId:String!, drrId:String!):Drr\n"+
		this.head.mutationFields()+
		this.notes.mutationFields()+
		this.plans.mutationFields()+
		this.deficiencies.mutationFields()+
		this.photos.mutationFields()
	)	
}

Drr.prototype.queryFields=function(){
	//returns a consolidated string of graphql query fields for Drr and its properties
	return (
		"drr(projectId:String!, drrId:String!):Drr\n"+
		this.head.queryFields()+
		this.notes.queryFields()+
		this.plans.queryFields()+
		this.deficiencies.queryFields()+
		this.photos.queryFields()
	)
}

Drr.prototype.typeDefs=function(){
	//returns a consolidated string of graphql type Defs for Drr and its properties
	return(
		"type Drr {\n"+
			this.head.queryFields()+
			this.notes.queryFields()+
			this.plans.queryFields()+
			this.deficiencies.queryFields()+
			this.photos.queryFields()+
		"}\n"+
		this.head.typeDefs()+
		this.notes.typeDefs()+
		this.plans.typeDefs()+
		this.deficiencies.typeDefs()+
		this.photos.typeDefs()
	)
}


Drr.prototype.resolvers=function(){
	//Returns an object
	//Notice object initializer shorthand method names in ES2015.  
	//Eg. {Drr(){...}} initializes {Drr:function(){...} }

	var that=this
	var ownResolvers={
		drr(projectId, drrId){that.deserialize()},
		drrCreate(){that.serialize()},
		drrIds(projectId){			
			console.log("drrId resolver...", projectId)
			//drrId are the folder names 
			//read datafile within each folder
			var ids=[]

			try {
				var p=PATH.join(CASITE, projectId, BRANCH)
				ids=FS.readdirSync(p).filter(function (file) {
					return FS.statSync(PATH.join(p,file)).isDirectory()
				})			
			} catch(e) {
				console.log("Error...", e)
			}
			return ids		

		}		
	}	
	
	return Object.assign(
		ownResolvers,
		this.head.resolvers(),
		this.notes.resolvers(),
		this.plans.resolvers(),
		this.deficiencies.resolvers(),
		this.photos.resolvers()	
	)	
}
// END OF EXPERIMENTAL
*/

// expose DRR handler
const DRR=new Drr()
exports.current=DRR

/////////////////////////////////////////
//DrrHead data Structure & default values
exports.typeDefs+=` 
type DrrHead {
	projectId:String
	drrId:String
	reviewDate:String
	reviewBy:String
	reportDate:String	
}

input DrrHeadInput {
	reviewDate:String
	reviewer:String
	reportDate:String	
}`

function DrrHead(projectId, drrId, days){
	//assume projectId & drrId are vetted
	//default values
	var today=new Date()
	var soon=addDays(today, days||10)
	this.projectId=projectId
	this.drrId=drrId
	this.reviewDate=today.toString().substring(0,15)
	this.reviewer="Reviewer"
	this.reportDate=soon.toString().substring(0,15)
	//call superclass which initializes JSON datafile
	jsonFiler.call(this, PATH.join(CASITE, projectId, BRANCH, drrId, FILENAME_HEAD))
}

EXTEND(DrrHead, jsonFiler)

//////////////////////////////////////////
//drrNotes Data Structure & default values

exports.typeDefs+=` 
type DrrNotes {
	projectId:String
	drrId:String
	items:[String]
}`

function DrrNotes(projectId, drrId){
	//assume projectId & drrId are vetted
	this.projectId=projectId
	this.drrId=drrId	
	this.items=["note"]
	//call superclass which initializes JSON datafile
	jsonFiler.call(this, PATH.join(CASITE, projectId, BRANCH, drrId, FILENAME_NOTES))
}

EXTEND(DrrNotes, jsonFiler)

/////////////////////////////////////////////
//deficiency Data Structure & default values

exports.typeDefs+=` 
type Deficiencies {
	projectId:String
	drrId:String
	items:[Deficiency]
}`

function Deficiencies(projectId, drrId){
	this.projectId=projectId
	this.drrId=drrId
	this.items=[new Deficiency()]
	//call superclass which initializes JSON datafile
	jsonFiler.call(this, PATH.join(CASITE, projectId, BRANCH, drrId, FILENAME_DEFICS)) 
}

EXTEND(Deficiencies, jsonFiler)

exports.typeDefs+=`
type Deficiency {
	deficId:String
	desc:String
	refId:String
	status:DrrStatus
}`

function Deficiency(){
	//random id with high probability of uniquness
	this.deficId=cryptoId()
	this.desc=desc||"description"
	this.refId="0"
	//last status is default
	this.status=status||DRR_STATUS[DRR_STATUS.length-1] 
}

////////////////////////////////////////////
//DrrPlan Data Structure & default values

exports.typeDefs+=` 
type DrrPlans {
	projectId:String
	drrId:String
	plans:[DrrPlan]
}`

function DrrPlans(projectId, drrId){
	var dir=PATH.join(CASITE, projectId, BRANCH, drrId, FOLDER_PLANS)	
	this.projectId=projectId
	this.drrId=drrId
	this.plans=[new DrrPlan()]
	//imageFiler(this, dir, objectsToLinkToImages)
	imageFiler.call(this, dir, this.plans)
	//jsonFiler.call(this, datafile)
	jsonFiler.call(this, PATH.join(dir, FILENAME_PLANS))
}

MIXINS(DrrPlans, jsonFiler, imageFiler)

exports.typeDefs+=`
type DrrPlan {
	planId:String
	title:String
	checklist:String
	notes:[String]
	deficiencyIds:[String]
	image:String
}`

function DrrPlan(title, checklist){
	//random id with high probability of uniquness
	this.planId=CRYPTO.randomBytes(10).toString('hex')	
	this.title=title||"Room 101"
	this.checklist=checklist||"standard"
	this.notes=["note"]
	this.deficiencyIds=[]
	//this field initialized by imageFiler from images in image folder
	this.image=""
}

//////////////////////////////////////////
//DrrPhoto Data Structure & default values

exports.typeDefs+=`
type DrrPhotos {
	projectId:String
	drrId:String
	photos:[DrrPhoto]
}`

function DrrPhotos(projectId, drrId){
	//assume projectId & drrId are vetted
	var dir=PATH.join(CASITE, projectId, BRANCH, drrId, FOLDER_PHOTOS)	
	this.projectId=projectId
	this.drrId=drrId
	this.photos=[new DrrPhoto()]
	//call imageFiler first since it loads properties from datafile
	jsonFiler.call(this, PATH.join(dir, FILENAME_PHOTOS))
	//call imageFiler last since it checks & updates this.photos with images in dir
	imageFiler.call(this, dir, this.photos)	
}

MIXINS(DrrPhotos, jsonFiler, imageFiler)

exports.typeDefs+=`
type DrrPhoto {
	caption:String
	date:String
	image:String
	photoId:String
}`

function DrrPhoto(){
	this.caption="caption"
	this.date=date||(new Date()).toString().substring(0,15) 
	//initialized elswhere
	this.image=""
	//random id with high probability of uniquness
	this.photoId=cryptoId()
}

///////////////////////////////////////////
//DrrStatus Data Structure & default values

exports.typeDefs+=`
enum DeficiencyStatus {
	OPEN
	CLOSED
	CRITICAL
	DROPPED
	INFO
	OPEN
}`

const DRR_STATUS=["Closed", "Critical", "Dropped", "Info", "Open"]


////////////////////////////////
//Resolvers
//function names relate to queryField names

exports.resolvers={

	drrIds(projectId){
		console.log("drrId resolver...", projectId)
		//drrId are the folder names 
		//read datafile within each folder
		var ids=[]

		try {
			var p=PATH.join(CASITE, projectId, BRANCH)
			ids=FS.readdirSync(p).filter(function (file) {
				return FS.statSync(PATH.join(p,file)).isDirectory()
			})			
		} catch(e) {
			console.log("Error...", e)
		}
		return ids		
	},
	
	drrHead(projectId, drrId){
		console.log("drrHead resolver...")
		var data
		try {
			var p=PATH.join(CASITE,	projectId, BRANCH, drrId, FILENAME_HEAD)
			console.log("trying FS.readFileSync...", p)
			data=JSON.parse(FS.readFileSync(p))
		} catch(e) {
			console.log("error:",e)
			//data={err:e, msg:"invalid projectId or drrId"}
			//testing only
			data=(new DrrHead(projectId, drrId)).getData()
		}
		return data
	},

	drrNotes(projectId, drrId){
		console.log("drrNotes resolver...")		
		var data
		try {
			var p=PATH.join(CASITE, projectId, BRANCH, drrId, FILENAME_NOTES)
			console.log("trying FS.readFileSync...", p)
			data=JSON.parse(FS.readFileSync(p))
		} catch(e) {
			console.log("error:",e)
			//data={err:e, msg:"invalid projectId or drrId"}
			//testing only
			data=(new DrrNote(projectId, drrId)).getData()
		}
		return data
	},

	createDrr(projectId){
		console.log("drrCreate resolver...")
		var	result
		try {
			var drr=new Drr(projectId, null)
			drr.serialize()
			result=drr.getOwn()
		} 
		catch(e){
			console.log("error:",e)	
			result={err:e}			
		}
		//return default data
		return result

	}
}


