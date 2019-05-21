/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")
const { gql } = require('apollo-server-express')

var site=path.join(global.appRoot, global.casite)

//Combine typeDefs
exports.typeDefs=[ 
	//gql is a tag literal function that ...
	gql`type Query { hello:String } schema {query:Query}`,
	require("./project").typeDef
]

//Combine resolvers
exports.resolvers={}
exports.resolvers.Query=Object.assign(
	{ hello(){console.log("hello resolver..."); return 'world'} },
	require("./project").resolvers.Query
)
