/**********************************
CASBAH* *Contract Admin Site Be Architectural Heroes
Copyright (c) 2018 Andrew Siddeley
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/
const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Site path
if (typeof global.appRoot=="undefined") {global.appRoot=path.resolve(__dirname)}
if (typeof global.casite=="undefined") {global.casite="uploads"}

// Main 
app.get('/', function (req, res) {res.sendFile(path.join(__dirname,"client","casbah.html"));})

// File server - images, libraries, jquery, bootstrap etc
app.use(express.static(__dirname))
if (__dirname!=global.appRoot) {app.use(express.static(global.appRoot))}

const { typeDefs, resolvers } = require(path.join(__dirname,"server","caschema"))
//console.log("resolvers...", resolvers.Query)

var schema=buildSchema(typeDefs)
//console.log("schema", typeDefs, schema)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.listen(4000, function(){
	console.log('Casbah site... http://localhost:4000')
	console.log('Casbah query playground... http://localhost:4000/graphql')
});
