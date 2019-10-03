/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const FS = require("fs")
const PATH = require("path")

var {getOwn, cryptoId}=require("./support").getOwn

//project record with default values
function Project({projectno, projectcode}){	
	var today=new Date()
	var future=addDays(today, days||365)
	//random id with high probability of uniquness
	this.projrctid=cryptoId()
	this.projectno=projectno||"PRO-001"
	this.projectcode=projectcode||"CASA"
	this.project="Casbah Building"
	this.subprojectcode=projectcode||"TV"
	this.subproject="The Ville"
	this.address="101 Desert Way"
	this.ownercode="Casbah"
	this.contractorcode="CasbahCon"
	this.start=today.toString().substring(0,15)
	this.finish=future.toString().substring(0,15)
	this.status="ongoing"
	this.permit="19 123456 00 00 BA"
	this.occupancy="TBD"
	this.areasm="TBD"
	this.cost="TBD"
	this.about="TBD"
}
//returns an object with only the above keys:values
Project.prototype.getData=getOwn

//factory
exports.create=function(options){return new Project(options)}

exports.mutationFields=`
	createProject(projectcode:String!):Project
	updateProject(projectcode:String!, project:ProjectInput!):Project
	deleteProject(projectcode:String!):Project
`

exports.queryFields=`
	readProjects:[Project]
	byProjectid(projectid:String!):Project
	bySubprojectcode(subprojectcode:String!):Project
`
exports.typeDefs=`
type Project {
	projectid:String
	projectno:String
	project:String
	subprojectcode:String
	subproject:String
	address:String
	ownercode:String
	contractorcode:String
	started:String
	finished:String
	projectstatus:ProjectStatus
	permit:String
	areasm:String
	cost:String
	about:String
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


//exports.resolvers=require("./projectResolversFS").resolvers

exports.resolvers=require("./projectResolversGS").resolvers