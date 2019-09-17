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


function Project(projectId){	
	this.projectId=projectId||"PRO-001"
	this.name="Casbah Building"
	this.address="101 Desert Way"
	this.owner="Casbah Client"
	this.contractor="CasbahCon"
	this.permit="19 123456 00 00 BA"
}
Project.prototype.getData=getOwn

exports.create=function(){
	return new Project()	
}

exports.mutationFields=`
	projectCreate(projectId:String!):Project
	projectUpdate(projectId:String!, project:ProjectInput!):Project
`

exports.queryFields=`
	projectIds:[String]
	projectById(projectId:String!):Project
`
exports.typeDefs=`
type Project {
	projectId:String
	name:String
	address:String
	owner:String
	contractor:String
	permit:String
	status:ProjectStatus
}

enum ProjectStatus{
	Proposal
	Pre_design
	Design
	Production
	Tendering
	Pre_construction
	Construction
	Post_construction
	Hold
	Closed_built
	Closed_unbuilt
}

input ProjectInput{
	name:String
	address:String
	owner:String
	contractor:String
	permit:String
	status:ProjectStatus
}`

//Note below how it's posible to define an object of functions without keys.
//https://www.apollographql.com/docs/tutorial/resolvers


const rFS={
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
		
		return Object.assign(PROJECT, {projectId:projectId})
	},
	
	projectUpdate({projectId}){
		console.log("projectUpdate resolver...", projectId)
		
		return PROJECT
	}
}


exports.resolvers=require("./projectGoogleDrive").resolvers