/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")

const __drrHead="__drrHead.json"
const __drrHeadDefault={
	
	
}



const casite=path.join(global.appRoot, global.casite)
const branch=path.join("reports", "deficiency reviews")

exports.mutationFields=`
	drrIdAdd(projectId:String!):String
	drrUpdate()
`

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
	

	drr__DEPRECATED({projectId, drrId}){
		
		console.log("drr resolver...", args)
		//read datafile within each folder
		//var data, figs, rooms
		try {
			var path=path.join(site, projectId, branch, drrId, __drr)
			var datafile=path.join(path, "__data.json")
			data=JSON.parse(fs.readFileSync(file))
		} catch(e) {
			data={}
		}
		return data
	},


	deficiencyHead({projectId, drrId}){
		console.log("deficiencyHead resolver...")
		var data={}	
		try {
			var path=path.join(site, projectId, branch, drrId, __drrHead)
			data=JSON.parse(fs.readFileSync(path))
		} catch(e) {
			data=__drrDefault
		}
		return data
	},
	
	deficiencyGenerals({projectId, drrId}){
		console.log("deficiencyGenerals resolver...")		
		var data={}	
		try {
			var path=path.join(site, projectId, branch, drrId, __drrGenerals)
			data=JSON.parse(fs.readFileSync(path))
		} catch(e) {
			data=__drrDefault
		}
		return data
	}	
	
}