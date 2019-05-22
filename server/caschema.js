/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/
const fs = require("fs")
const path = require("path")
const { gql } = require('apollo-server-express')

var site=path.join(global.appRoot, global.casite)


//Using .queryFields because the graphql 'extend type query{}' method is ineffective...
exports.typeDefs= 
	`type Query{
		hello:String`+
		require("./projectSchema").queryFields +
		require("./DRRschema").queryFields+
	`}`+
	require("./projectSchema").typeDefs +
	require("./DRRschema").typeDefs

//Combine resolvers
exports.resolvers=Object.assign(
	{ hello(){console.log("hello resolver..."); return 'HELLO WORLD!'} },
	require("./projectSchema").resolvers,
	require("./DRRschema").resolvers
)
