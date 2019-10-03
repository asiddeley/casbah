/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/

const GS=require('google-spreadsheet')
const PATH=require("path")
const SECRET=require("../dist/client_secret.json")
const PROJECT=new GS("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4");
//cache
var projects=null

exports.resolvers={
	readProjects(args){
		console.log("readProjects resolver...", args)
		projects=readProjects()
		return projects
	},
		
	byProjectid({projectid}){
		console.log("projectById resolver...", projectid)
		if (!projects){projects=readProjects()}
		return select(projects, "projectid", projectid)
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


async function readProjects(){

	await new Promise(function(done){
		PROJECT.useServiceAccountAuth(SECRET, done)
	})
	
	//rows object includes helpers: _xml, id, app:edited, _links, save, del	
	var rows=await new Promise(function(done){
		PROJECT.getRows(1, function(err, rows){ done(rows)})
	})
	
	return rows
}


async function select(rows, key, val){
	console.log("select...")
	console.log("rows is a promise:", rows instanceof Promise)
	//so wait for it...
	var rows=await rows
	//[0] because graphql schema expects 1 project record, not an array of one 
	return rows.filter(o=>(o[key]==val))[0]
}






