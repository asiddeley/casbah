/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")

var site=path.join(global.appRoot, global.casite)

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
}
`

exports.resolvers={
	//Note below how it's posible to define an object of functions without keys.
	//https://www.apollographql.com/docs/tutorial/resolvers
	projectIds(args){
		console.log("projectId resolver...")
		//project numbers are the folder names in the site path 
		return fs.readdirSync(site).filter(function (file) {
			return fs.statSync(path.join(site,file)).isDirectory()
		})
	},
		
	projectById({projectId}){
		
		console.log("projectById resolver...", projectId)
		//read datafile within each folder
		var data={}
		try {
			var file=path.join(site, projectId, "__projectData.json")
			data=JSON.parse(fs.readFileSync(file))
		} catch(e) {
			console.log("error:",e)
		}
		return data
	}				
}