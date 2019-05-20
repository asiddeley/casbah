/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")
const { gql } = require('apollo-server-express')

var site=path.join(global.appRoot, global.casite)

//gql is a tag literal function that ...
exports.typeDefs=[ gql`

type Query {
	hello:String
	pronum:[String]
	projectByNum(pronum:String!):Project
}

type Project {
	pronum:String
	name:String
	address:String
	owner:String
	contractor:String
	permit:String
}

schema {
	query:Query
}


`]

exports.resolvers={
	//Note below how it's posible to define an object of functions without keys.
	//https://www.apollographql.com/docs/tutorial/resolvers
	Query:{
		hello(){console.log("hello resolver..."); return 'world'},
	
		pronum(){
			console.log("pronum resolver...")
			//project numbers are the folder names in the site path 
			return fs.readdirSync(site).filter(function (file) {
				return fs.statSync(path.join(site,file)).isDirectory()
			})
		},
		
		projectByNum(parent, args, context, info){
			
			console.log("project resolver...", args)
			//read datafile within each folder
			var data
			var file=path.join(site, args.pronum, "__data.json")
			try {
				data=fs.readFileSync(file)
			} catch(e) {
				data="{'error':'datafile not found'}"
			}
			return JSON.parse(data)
		}				
	}	
}