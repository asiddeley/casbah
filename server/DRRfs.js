/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/

const FS = require("fs")
const FSP = require("fs-plus")
const PATH = require("path")
const DRR=require("./DRRschema")
const BRANCH=PATH.join("reports", "deficiency reviews")
const CASITE=PATH.join(global.appRoot, global.casite)

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


