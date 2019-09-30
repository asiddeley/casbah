/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const FS = require("fs")
const PATH = require("path")
const SITE=PATH.join(global.appRoot, global.casite)
const DATAFILE="__projectData.json"

var {getOwn}=require("./support")

//get a project record with default values
var project=require("./projectSchema").create()

//Note below how it's posible to define an object of functions without keys.
//https://www.apollographql.com/docs/tutorial/resolvers


exports.resolvers={
	projectIds(args){
		console.log("projectId resolver FS...")
		//project numbers are the dir names (filtered from array of file and dirs in site) 
		return FS.readdirSync(SITE).filter(function (file) {
			return FS.statSync(PATH.join(SITE,file)).isDirectory()
		})
	},
		
	projectById({projectId}){
		
		console.log("projectById resolver...", projectId)
		//read DATAFILE within each folder
		var data={}
		try {
			var file=PATH.join(SITE, projectId, DATAFILE)
			data=JSON.parse(FS.readFileSync(file))
		} catch(e) {
			console.log("error:",e)
		}
		return data
	},	

	projectCreate({projectId}){
		console.log("projectCreate resolver...", projectId)
		//code to create dir...
		var dir=projectId
		
		return Object.assign(project, {projectId:projectId})
	},
	
	projectUpdate({projectId}){
		console.log("projectUpdate resolver...", projectId)
		
		return project
	}
}

