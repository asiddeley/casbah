/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/

//const FS=require('fs')
//readline=require('readline')
const {google}=require('googleapis')
//request=require('request')
const GoogleSheet=require('google-spreadsheet')
//console.log("__dirname:",__dirname)
const PATH=require("path")
const SECRET=require("../dist/client_secret.json")
//const ASYNC=require('async')

//CASBAH project spreadsheet key in googledrive
//1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4

const PROJECT=new GoogleSheet("1tKvabqktU80rAFZ2PEC6-iDQwI2DwG3xKLcKLoI16N4");


exports.resolvers={
	readProjects(args){
		console.log("resolving readProjects...", args)
		return readProjects()
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

/*
function getProjects(){
	var data
	ASYNC.series([
		function(done){prj.useServiceAccountAuth(SECRET, done)}, 
		function(done){getRows(1, done)}
		], function(err, results){data=results[1]}
	)
	return data
}
*/

async function readProjects(){
	var raws, rows
	var nonfields=["_xml","id","app:edited","_links","save","del"]
	
	await new Promise(function(done){
		PROJECT.useServiceAccountAuth(SECRET, done)
	})
	await new Promise(function(done){
		PROJECT.getRows(1, function(err, data){
			raws=data
			done()
		})
	})
	//filter data
	rows=raws.map(function(raw){
		var row={}
		Object.keys(raw).forEach(function(key){
			//filter out the badkey objects
			if (!nonfields.includes(key)){ row[key]=raw[key] }
		})
		return row
	})	
	return rows
}



function getRows(n, done){
	var badkeys=["_xml","id","app:edited","_links","save","del"]
	var rows
	PROJECT.getRows(n,	function (err, raws){
		//raws includes spreadsheet row objects {field:value} mixed with badkey objects 
		if (err){
			console.log("err:", err)
			done(err)
		} else {
			rows=raws.map(function(raw){
				var row={}
				Object.keys(raw).forEach(function(key){
					//filter out the badkey objects
					if (!badkeys.includes(key)){ row[key]=raw[key] }
				})
				return row
			})
			done(null, rows)
		}
	})
}








