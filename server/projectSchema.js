/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const FS = require("fs")
const PATH = require("path")

const SITE=PATH.join(global.appRoot, global.casite)
const DATAFILE="__projectData.json"

//to do...
//const {gql2obj}=require(path(__dirname,"server","utilities"))
//const {Project}=gql2json(exports.typeDefs)
//instead of...

const PROJECT={	
	projectId:"PRO-001",
	name:"Casbah Building",
	address:"101 Desert Way",
	owner:"Casbah Client",
	contractor:"CasbahCon",
	permit:"19 123456 00 00 BA"
}

exports.current=PROJECT



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

exports.resolvers={
	projectIds(args){
		console.log("projectId resolver...")
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