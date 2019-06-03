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
//for console.log
const BLUE="\x1b[34m", RESET="\x1b[0m"

//Schema plus default data values for Filesystem database as an object...
var drr=new TypeDefo({

//type query fields...
TYPE_QUERY:{
	drrIds:{ARG:["projectId:String!"], TYPE:"[String]"},
	drr:{ARG:["projectId:String!", "drrId:String!"], TYPE:"Drr"}
},

//types (for query fields)
TYPE:{
	Drr:{
		drrHead:{ARG:["projectId:String!", "drrId:String!"], TYPE:"DrrHead"},
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
	
	DrrGeneral:{
		id:1,
		note:"--"
	},

	Deficiency: {
		id:1,
		description:"Description of deficiency",
		deficiencyStatus:{TYPE:"DeficiencyStatus"}
	},
	
	//depends on what images uploaded to rooms folder
	DrrByRoom:{
		room:"1-01 Lobby",
		checklist:"[_]paint, [_]hardware...",
		deficiencies:{ARG:["projectId:String!", "drrId:String!"], TYPE:"[Deficiency]"}, 
		img:"1-01 Lobby.png"
	},
	
	//depends on what images uploaded to parent folder
	DeficiencyFig:{
		id:1,
		img:"image-file",
		title:"image-filename",
		date:"25-May-2019"
	}
},

ENUM:{
	DeficiencyStatus:[
		"CLOSED",
		"CRITICAL",
		"INFO",
		"OPEN",
		"NA"		
	]	
},

//type mutation fields...
TYPE_MUTATION:{
	createDrr:{ARG:["projectId:String!", "drrId:String!"], TYPE:"Drr"}
	
},

//inputs (for mutation fields)... 
INPUT:{
	DrrHeadInput: {
		reviewDate:"28-May-2019",
		reviewBy:"A. Siddeley",
		reportDate:"28-May-2019"	
	}
},

//properties
PROP:{
	casite:path.join(global.appRoot, global.casite),
	branch:path.join("reports", "Deficiency Reviews"),
	drrHeadFile:"__drrHead.json",
	deficiencyFile:"__deficiency.json",
	drrByRoomFolder:"rooms"
}


}) //End of DRR TypeDefo
 
///////////////////////////////////////////////
//exports of graphql Schema Definition Language (SDL)

exports.mutationFields=drr.toMutationFields()
console.log(BLUE, "MUTATION FIELDS\n", RESET, exports.mutationFields)

exports.queryFields=drr.toQueryFields()
console.log(BLUE, "QUERY FIELDS\n", RESET, exports.queryFields)

exports.typeDefs=drr.toTypeDefs()
console.log(BLUE, "TYPE DEFS\n", RESET, exports.typeDefs)
//console.log(BLUE,"DRR DATA...\n", RESET, drr.data)



////////////////////////////////
//Resolvers

exports.resolvers={

	drrIds({projectId}){
		console.log("drrId resolver...", projectId)
		//drrId are the folder names 
		//read datafile within each folder
		var ids=[]

		try {
			var p=path.join(drr.prop.casite, projectId, drr.prop.branch)
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
		data=drr.data.drrHead //default data 
		try {
			var p=path.join(
				drr.prop.casite, 
				projectId, 
				drr.prop.branch, 
				drrId, 
				drr.prop.drrHeadFile
			)
			data=JSON.parse(fs.readFileSync(p))
		} catch(e) {console.log("error:",e)}
		return data
	},
	
	drrGenerals({projectId, drrId}){
		console.log("drrGenerals resolver...")		
		var data=drr.data.drrGenerals //default data	
		try {
			var p=path.join(site, projectId, branch, drrId, drrGeneralsFile)
			data=JSON.parse(fs.readFileSync(p))
		} catch(e) {console.log("error:",e)}
		return data
	},

	createDrr({projectId, drrId}){
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


