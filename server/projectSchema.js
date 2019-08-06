/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")

const site=path.join(global.appRoot, global.casite)

//to do...
//const {gql2obj}=require(path(__dirname,"server","utilities"))
//const {Project}=gql2json(exports.typeDefs)
//instead of...

const Project={	
	projectId:"PROJ-A001",
	name:"Casbah Building",
	address:"101 Desert Way",
	owner:"Casbah Client",
	contractor:"CasbahCon",
	permit:"19 123456 00 00 BA"
}

const datafile="__projectData.json"

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
}
`

exports.resolvers={
	//Note below how it's posible to define an object of functions without keys.
	//https://www.apollographql.com/docs/tutorial/resolvers
	projectIds(args){
		console.log("projectId resolver...")
		//project numbers are the dir names (filtered from array of file and dirs in site) 
		return fs.readdirSync(site).filter(function (file) {
			return fs.statSync(path.join(site,file)).isDirectory()
		})
	},
		
	projectById({projectId}){
		
		console.log("projectById resolver...", projectId)
		//read datafile within each folder
		var data={}
		try {
			var file=path.join(site, projectId, datafile)
			data=JSON.parse(fs.readFileSync(file))
		} catch(e) {
			console.log("error:",e)
		}
		return data
	},	

	projectCreate({projectId}){
		console.log("projectCreate resolver...", projectId)
		//code to create dir...
		var dir=projectId
		
		return Object.assign(Project, {projectId:projectId})
	},
	
	projectUpdate({projectId}){
		console.log("projectUpdate resolver...", projectId)
		
		
		return Project
	}
}