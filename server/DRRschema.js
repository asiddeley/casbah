/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const fsp = require("fs-plus")
const path = require("path")
const {TypeDefo}=require(path.join(__dirname,"casbah-graphql"))

const casite=path.join(global.appRoot, global.casite)
const branch=path.join("reports", "deficiency reviews")

//Default values for Filesystem database
var td=new TypeDefo({

PROP:{
	casite:path.join(global.appRoot, global.casite),
	branch:path.join("reports", "deficiency reviews"),
	DrrHeadFile:"__drrHead.json"	
},

//type mutation fields...
MTYPE:{},

//inputs (for mutation fields)... 
INPUT:{
	DrrHeadInput: {
		reviewDate:"28-May-2019",
		reviewBy:"A. Siddeley",
		reportDate:"28-May-2019"	
	}
},

//type query fields...
QTYPE:{
	drrIds:{ARGS:["projectId:String!"], TYPE:"[String]"},
	drr:{ARGS:["projectId:String!", "drrId:String!"], TYPE:"Drr"}
},

//types (for query fields)
TYPE:{
	Drr:{
		drrHead:{ARG:["projectId:String!", "drrId:String!"], TYPE:"Drrhead"},
		drrGenerals:{ARG:["projectId:String!", "drrId:String!"], TYPE:"[DrrGeneral]"},
		deficiencies:{ARG:["projectId:String!", "drrId:String!"], TYPE:"[Deficiency]"}, 
		drrByRooms:{ARG:["projectId:String!", "drrId:String!"], TYPE:"[DrrByRoom]"}, 
		deficiencyFigs:{ARG:["projectId:String!", "drrId:String!"], TYPE:"[DeficiencyFig]"}
	},
	DrrHead:{
		//type and default data value explicitly defined 
		drrId:{TYPE:"String", DATA:"DRR-A01"},
		//type implied as string from default data value
		reviewDate:"25-May-2019",
		reviewBy:"AS",
		reportDate:"25-May-2019"
	},
},
ENUM:{
	
	
}

})
 
const DrrHeadFile="__drrHead.json"
const DrrHead={
	drrId:"DRR-A01",
	reviewDate:"25-May-2019",
	reviewBy:"AS",
	reportDate:"25-May-2019"
}

const DrrGeneralFile="__drrGeneral.json"
const DrrGeneral={
	no:1,
	note:"General note"
}
const DeficiencyFile="__deficiency.json"
const Deficiency={
	id:1,
	description:"Paint touch-up required above window",
	deficiencyStatus:"open"
}
const DrrByRoomFolder="rooms"
//depends on what images uploaded to rooms folder
const DrrByRoom={
	room:"1-01 Lobby",
	checklist:"[_]paint, [_]hardware...",
	comments:"",
	img:"1-01 Lobby.png"
}
//depends on what images uploaded to parent folder
const DeficiencyFig={
	id:1,
	img:"image-file",
	title:"image-filename",
	date:"25-May-2019"
}

const Drr={
	drrHead:DrrHead, //ok
	drrGenerals:[DrrGeneral], //ok
	deficiencies:[Deficiency], //ok
	drrByRooms:[DrrByRoom], //ok
	deficiencyFigs:[DeficiencyFig] //ok
}


// graphql Schema Definition Language (SDL)
//exports.mutationFields=Drr.mutationFields()


exports.mutationFields=`
	drrCreate(projectId:String!, drrId:String!):Drr
	drrHeadUpdate(projectId:String!, drrId:String!, drrHeadInput:DrrHeadInput!):Drr
`

exports.queryFields=`
	drrIds(projectId:String!):[String]
	drr(projectId:String!, drrId:String!):Drr
`
console.log("QUERY FIELDS toolkit...", td.queryFields())
console.log("QUERY FIELDS text...", exports.queryFields)

exports.typeDefs=`

type Drr {
	drrHead(projectId:String!, drrId:String!):DrrHead
	drrGenerals(projectId:String!, drrId:String!):[DrrGeneral]
	drrByRooms(projectId:String!, drrId:String!):[DrrByRoom]
	deficiencies(projectId:String!, drrId:String!):[Deficiency]
	deficiencyFigs(projectId:String!, drrId:String!):[DeficiencyFig]
}

type DrrHead {
	drrId:String
	reviewDate:String
	reviewBy:String
	reportDate:String	
}

input DrrHeadInput {
	reviewDate:String
	reviewBy:String
	reportDate:String	
}

type DrrGeneral {
	id:String
	note:String
}

type Deficiency {
	id:String
	description:String
	deficiencyStatus:DeficiencyStatus
}

type DrrByRoom{
	room:String
	checklist:String
	comments:String
	img:String
}

type DeficiencyFig{
	id:String
	img:String
	title:String
	date:String
}

enum DeficiencyStatus{
	CLOSED
	CRITICAL
	INFO
	OPEN
	NA
}
`
console.log("td...", td.toTypeDefs())
//console.log("text...", exports.typeDefs)

console.log("td.branch:", td.prop.branch)	
console.log("td.casite:", td.prop.casite)	
console.log("td.DrrHeadFile:", td.data.DrrHeadFile)	
console.log("td.drrId:", td.data.drrId)	
console.log("td.reviewDate:", td.data.reviewDate)	


exports.resolvers={

	drrId({projectId}){
		console.log("drrId resolver...", projectId, drrId)
		//drrId are the folder names 
		//read datafile within each folder
		var ids=[]

		try {
			var branch=td.branch;
			var p=path.join(casite, projectId, branch)
			ids=fs.readdirSync(p).filter(function (file) {
				return fs.statSync(path.join(p,file)).isDirectory()
			})			
		} catch(e) {
			console.log("Error...", e)
		}
		return ids		
	},
	

	drr__DEPRECATED({projectId, drrId}){
		
		console.log("drr resolver...", args)
		//read datafile within each folder
		//var data, figs, rooms
		try {
			var p=path.join(site, projectId, td.branch, drrId, __drr)
			var datafile=path.join(p, "__data.json")
			data=JSON.parse(fs.readFileSync(file))
		} catch(e) {
			data={}
		}
		return data
	},


	drrHead({projectId, drrId}){
		console.log("drrHead resolver...")
		var data=DRRhead //default	
		try {
			var p=path.join(site, projectId, branch, drrId, drrHeadFile)
			data=JSON.parse(fs.readFileSync(p))
		} catch(e) {console.log("error:",e)}
		return data
	},
	
	drrGenerals({projectId, drrId}){
		console.log("drrGenerals resolver...")		
		var data=DRRgeneral //default	
		try {
			var p=path.join(site, projectId, branch, drrId, drrGeneralsFile)
			data=JSON.parse(fs.readFileSync(p))
		} catch(e) {console.log("error:",e)}
		return data
	},

	drrCreate({projectID, drrId}){
		console.log("drrCreate resolver...")		
		try {
			var p=path.join(site, projectId, branch, drrId)
			//make folder
			fsp.makeTreeSync(p)
			//make datafiles in folder
			fs.writeFileSync(path.join(p, DrrHeadFile), JSON.stringify([DrrHead]))
			fs.writeFileSync(path.join(p, DrrGeneralFile), JSON.stringify([DrrGeneral]))
			fs.writeFileSync(path.join(p, DeficiencyFile), JSON.stringify([Deficiency]))
			//make rooms folder
			fsp.makeTreeSync(path.join(p, DeficiencyByRoomFolder))

		} catch(e) {console.log("error:",e)}
		//return default data
		return DRR
	}
	
	
	
	
	
}