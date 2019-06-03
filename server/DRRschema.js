/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const fsp = require("fs-plus")
const path = require("path")
//const {TypeDefo}=require(path.join(__dirname,"casbah-graphql"))

const casite=path.join(global.appRoot, global.casite)
const branch=path.join("reports", "deficiency reviews")
//for console.log
const BLUE="\x1b[34m", RESET="\x1b[0m"




///////////////////////////////////////////////
//export graphql Schema Definition Language (SDL)


exports.mutationFields=`
	drrCreate(projectId:String!, drrId:String!):Drr
	drrHeadUpdate(projectId:String!, drrId:String!, drrHeadInput:DrrHeadInput!):Drr
`

exports.queryFields=`
	drrIds(projectId:String!):[String]
	drr(projectId:String!, drrId:String!):Drr
`

exports.typeDefs=`
type Drr {
	drrHead(projectId:String!, drrId:String!):DrrHead
	drrGenerals(projectId:String!, drrId:String!):[DrrGeneral]
	drrByRooms(projectId:String!, drrId:String!):[DrrByRoom]
	deficiencies(projectId:String!, drrId:String!):[Deficiency]
	deficiencyFigs(projectId:String!, drrId:String!):[DeficiencyFig]
}`

//default data values
function Drr({projectId, drrId}){
	this.drrHead=new DrrHead()
	this.drrGenerals=[new DrrGeneral()]
	this.drrByRooms=[new DrrByRoom()]
	this.deficiencies=[new Deficiency()]
	this.deficiencyFigs=[new DeficiencyFig()]
}

exports.typeDefs+=`
type DrrHead {
	drrId:String
	reviewDate:String
	reviewBy:String
	reportDate:String	
}`

function DrrHead({projectId, drrId}){
	this.drrId=drrId
	this.reviewDate=new Date().toJSON().slice(0,10).replace(/-/g,'/')
	this.reviewBy="ASiddeley"
	this.reportDate="TBD"
}
const DrrHeadFile="__drrHead.json"

exports.typeDefs+=`
input DrrHeadInput {
	reviewDate:String
	reviewBy:String
	reportDate:String
}`

//no data funtion needed for Inputs - data supplied

exports.typeDefs+=`
type DrrGeneral {
	num:Int
	note:String
	ref:String
}
`

function DrrGeneral({projectId, drrId}){
	this.id=1
	this.comment="--"
	this.ref="--"
}
const DrrGeneralFile="__drrGeneral.json"

exports.typeDefs+=`
type Deficiency {
	id:String
	description:String
	deficiencyStatus:DeficiencyStatus
}
`

function Deficiency({projectId, drrId}){
	this.id=1
	this.description="--"
	this.deficiencyStatus="OPEN"
}
const DeficiencyFile="__deficiency.json"

exports.typeDefs+=`
type DrrByRoom{
	room:String
	checklist:String
	comments:String
	img:String
}
`
exports.typeDefs+=`
type DeficiencyFig{
	id:String
	img:String
	title:String
	date:String
}
`

exports.typeDefs+=`
enum DeficiencyStatus{
	OPEN
	CLOSED
	CRITICAL
	INFO
	NA
}
`




////////////////////////////////
//Resolvers

exports.resolvers={

	drrIds({projectId}){
		console.log("drrId resolver...", projectId)
		//drrId are the folder names 
		//read datafile within each folder
		var ids=[]

		try {
			var p=path.join(casite, projectId, branch)
			ids=fs.readdirSync(p).filter(function (file) {
				return fs.statSync(path.join(p,file)).isDirectory()
			})			
		} catch(e) {
			console.log("Error...", e)
		}
		return ids		
	},
	
	drrHead({projectId, drrId}){
		console.log("drrHead resolver...")
		//data=drr.data.drrHead //default data 
		data=new DrrHead()
		try {
			var p=path.join(
				casite, 
				projectId, 
				branch, 
				drrId, 
				DrrHeadfile
			)
			data=JSON.parse(fs.readFileSync(p))
		} catch(e) {console.log("error:",e)}
		return data
	},
	
	drrGenerals({projectId, drrId}){
		console.log("drrGenerals resolver...")		
		var data=[new DrrGeneral()] //default data	
		try {
			var p=path.join(casite, projectId, branch, drrId, DrrGeneralFile)
			data=JSON.parse(fs.readFileSync(p))
		} catch(e) {console.log("error:",e)}
		return data
	},

	createDrr({projectId, drrId}){
		console.log("drrCreate resolver...")
		var data=new Drr()		
		try {			
			var p=path.join(casite, projectId, branch, drrId)
			//make folder
			fsp.makeTreeSync(p)
			//make datafiles in folder
			fs.writeFileSync(path.join(p, DrrHeadFile), JSON.stringify(data.drrHead))
			fs.writeFileSync(path.join(p, DrrGeneralFile), JSON.stringify(data.drrGenerals))
			fs.writeFileSync(path.join(p, DeficiencyFile), JSON.stringify(data.deficiencies))
			//make rooms folder
			fsp.makeTreeSync(path.join(p, DeficiencyByRoomFolder))

		} catch(e) {console.log("error:",e)}
		//return default data
		return data
	}
}


