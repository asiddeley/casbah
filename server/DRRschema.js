/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const FS = require("fs")
const FSP = require("fs-plus")
const PATH = require("path")
const PROJECT = require("./projectSchema")
// console codes
const BLUE="\x1b[34m", RESET="\x1b[0m"
// support
const {addDays, dirCountPlus, getOwn, EXTEND, MIXIN, cryptoId} = require(PATH.join(__dirname,"support"))


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
	projectId=projectId||PROJECT.create().projectId
	
	//do this in the resolver module
	//ensure DRR folder exists
	//FSP.makeTreeSync(PATH.join(CASITE, projectId, BRANCH))
	
	//do this in the resolver module, check storage (fs of googleDrive) for naming 
	//check drrId - create new drrId based on folder count
	//drrId=drrId||("DRR-A"+dirCountPlus(PATH.join(CASITE, projectId, BRANCH), 1))

	drrId=drrId||null
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

///////////////////////////
// factory method because new Drr() requires many functions and constants
// only available in this module scope. 
exports.create=function(){
	return new Drr()	
}

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
}
DrrHead.prototype.getData=getOwn

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
}
DrrNotes.prototype.getData=getOwn


/////////////////////////////////////////////
//deficiency Data Structure & default values

exports.typeDefs+=` 
type Deficiencies {
	projectId:String
	drrId:String
	items:[Deficiency]
}`

function Deficiencies(projectId, drrId){
	//assume projectId & drrId are vetted
	this.projectId=projectId
	this.drrId=drrId
	this.items=[new Deficiency()]
	//call superclass which initializes JSON datafile
	jsonFiler.call(this, PATH.join(CASITE, projectId, BRANCH, drrId, FILENAME_DEFICS)) 
}

Deficiencies.prototype.getData=function(){
	return {
		projectId:this.projectId,
		drrId:this.drrId,
		items:this.items.map(i->i.getData())
	}	
}


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
Deficiency.prototype.getData=getOwn

////////////////////////////////////////////
//DrrPlan Data Structure & default values

exports.typeDefs+=` 
type DrrPlans {
	projectId:String
	drrId:String
	plans:[DrrPlan]
}`

function DrrPlans(projectId, drrId){
	//var dir=PATH.join(CASITE, projectId, BRANCH, drrId, FOLDER_PLANS)	
	this.projectId=projectId
	this.drrId=drrId
	this.plans=[new DrrPlan()]
	//imageFiler(this, dir, objectsToLinkToImages)
	//imageFiler.call(this, dir, this.plans)
	//jsonFiler.call(this, datafile)
	//jsonFiler.call(this, PATH.join(dir, FILENAME_PLANS))
}
DrrPlans.prototype.getData=function(){
	return {
		projectId:this.projectId,
		drrId:this.drrId,
		plans:this.plans.map(p->p.getData())
	}
}
//deprecated, implement in resolvers
//MIXINS(DrrPlans, jsonFiler, imageFiler)

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
MIXINS(DrrPlan, getData)

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

//MIXINS(DrrPhotos, jsonFiler, imageFiler)
MIXINS(DrrPhotos, getData)

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
// Resolvers
// function names relate to queryField names
// choose the storage...

// exports.resolvers=require("./DRRfs").resolvers
exports.resolvers=require("./DRRgoogleDrive").resolvers


