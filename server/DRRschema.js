/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")

var casite=path.join(global.appRoot, global.casite)
var branch=path.join("reports", "deficiency reviews")

exports.queryFields=`
	drrId(projectId:String!):[String]
	drr(projectId:String!, drrId:String!):DRR
`

exports.typeDefs=`

type DRR {
	deficiencyHead(projectId:String!, drrId:String!):DeficiencyHead
	deficiencyGenerals(projectId:String!, drrId:String!):[DeficiencyGenerals]
	deficiencyItems(projectId:String!, drrId:String!):[DeficiencyItem]
	deficiencyItemsByRoom(projectId:String!, drrId:String!):[DeficiencyItemsByRoom]
	deficiencyFigs(projectId:String!, drrId:String!):[DeficiencyFig]
}

type DeficiencyHead {
	drrId:String
	projectID:String
	reviewDate:String
	reviewBy:String
	reportDate:String	
}

type DeficiencyGenerals {
	id:String
	note:String
}

type DeficiencyItem {
	deficiencyId:String
	description:String
	deficiencyStatus:DeficiencyStatus
}

type DeficiencyItemsByRoom{
	room:String
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

exports.resolvers={

	drrId({projectId}){
		console.log("drrId resolver...", projectId, drrId)
		//drrId are the folder names 
		//read datafile within each folder
		var ids=[]

		try {
			var path=path.join(casite, args.projectId, branch)
			ids=fs.readdirSync(path).filter(function (file) {
				return fs.statSync(path.join(path,file)).isDirectory()
			})			
		} catch(e) {
			console.log("Error...", e)
		}
		return ids		
	},
	

	drr({projectId, drrId}){
		
		console.log("drr resolver...", args)
		//read datafile within each folder
		//var data, figs, rooms
		//try {
		//	var path=path.join(site, args.projectId, "reports", "deficiency reviews", args.drrId)
		//	var datafile=path.join(path, "__data.json")
		//	data=fs.readFileSync(file)
		//} catch(e) {
		//	data=`{"error":"datafile not found"}`
		//}
		//return JSON.parse(data)
	},


	deficiencyHeader(parent, args, context, info){
		console.log("deficiencyHeader resolver...", arguments)	
		/*var data
		try {
			var datafile=path.join(site, args.projectId, branch, args.drrId,"__headerData.json")
			data=JSON.parse(fs.readFileSync(datafile))
		} catch(e) {
			console.log("error:", e)
			data={}
		}
		return data*/
	},
	
	deficiencyGenerals(parent, args, context, info){
		console.log("deficiencyGenerals resolver...", arguments)		
		/*try {
			var datafile=path.join(site, args.projectId, branch, args.drrId, "__generalData.json")
			data=JSON.parse(fs.readFileSync(datafile))
		} catch(e) {
			data={}
		}
		return data */
	}	
	
}