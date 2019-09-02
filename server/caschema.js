/**********************************
CASBAH* *Contract Admin System Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/


//Using .queryFields because graphql hasn't yet implemented 'extend type query{}' 
exports.typeDefs="type Query{ hello:String " +
	require("./projectSchema").queryFields +
	require("./DRRschema").queryFields +
	" } " +
	"type Mutation{ " +
	require("./projectSchema").mutationFields +
	require("./DRRschema").mutationFields +
	" } " +
	require("./projectSchema").typeDefs +
	require("./DRRschema").typeDefs 
	
/* 
// EXPERIMENTAL
const {Project}=require("./projectSchema")
const project=new Project()
exports.typeDefs+=project.mutationFields()
exports.typeDefs+=project.queryFields()
exports.typeDefs=project.typeDefs()
exports.typeDefs=project.resolvers()
*/

//Combine resolvers
exports.resolvers=Object.assign(
	{ hello(){console.log("hello resolver..."); return 'HELLO WORLD!'} },
	require("./projectSchema").resolvers,
	require("./DRRschema").resolvers
)
