/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const FS = require("FS")
const FSP = require("FS-plus")
const PATH = require("PATH")

//console codes
const BLUE="\x1b[34m", RESET="\x1b[0m"

//DRR folders and files 
const BRANCH=PATH.join("reports", "deficiency reviews")
const CASITE=PATH.join(global.appRoot, global.casite)//for console.log
const FILENAME_HEAD="head.json"
const FILENAME_NOTES="notes.json"
const FILENAME_DEFICIENCIES="deficiencies.json"
const FILENAME_PLANS="plans.json"
const FILENAME_PHOTOS="photos.json"
const FOLDER_PLANS="plans"
const FOLDER_PHOTOS="photos"

//support functions
const {addDays, fileKeyPlus1, getOwn} = require(path.join(__dirname,"support"))


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
	drrNotes(projectId:String!, drrId:String!):[DrrNote]
	drrPlans(projectId:String!, drrId:String!):[DrrPlan]
	deficiencies(projectId:String!, drrId:String!):[Deficiency]
	drrPhotos(projectId:String!, drrId:String!):[DrrPhoto]
}`

function Drr(projectId, drrId){

	//create new drrId based on folder count
	drrId=drrId||"DRR-A"+folderCountPlus1(PATH.join(CASITE, projectId, BRANCH, projectId))
	this.home=PATH.join(CASITE, projectId, BRANCH, drrId)

	this.head=new DrrHead(drrId)
	this.notes=[new DrrNote(PATH.join(this.home, FILENAME_NOTES))]
	this.deficiencies=[new Deficiency(PATH.join(this.home, FILENAME_DEFICIENCIES))]
	this.plans=[new DrrPlan(projectId, drrId)]
	this.photos=[new DrrPhoto()]
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

Drr.prototype.serialize=function(){
	
	//TODO...
	//make datafiles in folder
	this.head.serialize(this.home)
	this.notes.serialize(this.home)
	this.plans.serialize(this.home)
	this.deficiencies(this.home)
	this.photos(this.home)
	//FS.writeFileSync(PATH.join(this.home, FILENAME_HEAD), JSON.stringify(head))
	//FS.writeFileSync(PATH.join(this.home, FILENAME_NOTES), JSON.stringify(notes))
	//FS.writeFileSync(PATH.join(this.home, FILENAME_PHOTOS), JSON.stringify(defys))
	//make rooms folder
	FSP.makeTreeSync(PATH.join(this.home, FOLDER_PLANS))
}

Drr.prototype.typeDef=function(){
	td=` 
		type Drr {
		drrHead(projectId:String!, drrId:String!):DrrHead
		drrNotes(projectId:String!, drrId:String!):[DrrNote]
		drrPlans(projectId:String!, drrId:String!):[DrrPlan]
		deficiencies(projectId:String!, drrId:String!):[Deficiency]
		drrPhotos(projectId:String!, drrId:String!):[DrrPhoto]
	}`

	td+=this.head.typeDef()+
	this.notes.typeDef()+
	this.plans.typeDef()+
	this.deficiencies.typeDef()+
	this.photos.typeDef()
	return td
}




//drrHead data Structure & default values
exports.typeDefs+=` 
type DrrHead {
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

function DrrHead(drrId, days){
	var today=new Date()
	var soon=addDays(today, days||10)
	this.drrId=drrId
	this.reviewDate=today.toString().substring(0,15)
	this.reviewer="Reviewer"
	this.reportDate=soon.toString().substring(0,15)
}
DrrHead.prototype.getData=getOwn
DrrHead.prototype.serialize=function(home){
	FS.writeFileSync(PATH.join(home, FILENAME_HEAD), JSON.stringify(this.getData()))
}

//drrNotes Data Structure & default values
exports.typeDefs+=` 
type DrrNote {
	id:String
	note:String
}`

function DrrNote(file){
	this.id=fileKeyPlus1(file, "id")
	this.note=note||("new note " + this.id.toString())
}
DrrNote.prototype.getData=getOwn
DrrNote.prototype.serialize=function(home){
	FS.writeFileSync(PATH.join(home, FILENAME_NOTES), JSON.stringify(this.getData()))

}

//deficiency Data Structure & default values
exports.typeDefs+=` 
type Deficiency {
	id:String
	desc:String
	status:DrrStatus
	pin:DrrPin
}`

function Deficiency(file, desc, status){
	this.id=fileKeyPlus1(file, "id")
	this.desc=desc||"description"
	this.status=status||"open"
}

Deficiency.prototype.getOwn=getOwn

//DrrPlan Data Structure & default values
exports.typeDefs+=` 
type DrrPlan{
	title:String
	checklist:String
	notes:[DrrNotes]
	deficiencyIds:[String]
	image:String
`

function DrrPlan(projectId, planId, checklist, status){
	var file=PATH.join(CASITE, projectId, BRANCH, drrId, planId, FILENAME_NOTES)
	this.title=planId||"Room 101"
	this.checklist=checklist||"standard"
	this.notes=[new DrrNote(file)]
	this.status=status||DRR_STATUS[DRR_STATUS.length-1] //last status is default
}

DrrPlan.prototype.getOwn=getOwn

//DrrPhoto Data Structure & default values
exports.typeDefs+=`
type DrrPhoto{
	id:String
	image:String
	caption:String
	date:String
}`

function DrrPhoto(projectId, planId, caption, date, image){
	var file=PATH.join(CASITE, projectId, BRANCH, drrId, planId, FILENAME_PHOTOS)
	this.id=fileKeyPlus1(file, "id")
	this.caption=caption||"caption"
	this.date=date||(new Date()).toString().substring(0,15) //taday
	this.image=image||"unnamed.png"
}
DrrPhoto.prototype.getOwn=getOwn

//DrrStatus Data Structure & default values
exports.typeDefs+=`
enum DeficiencyStatus{
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
			data=(new DrrHead()).getOwn()
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
			data=[(new DrrNote()).toJSON()]
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


