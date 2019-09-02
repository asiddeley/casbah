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
const EXPRESS = require("express")
const APP = EXPRESS()
const PATH = require("path")
const GRAPHQL_HTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Site path
if (typeof global.appRoot=="undefined") {global.appRoot=PATH.resolve(__dirname)}
if (typeof global.casite=="undefined") {global.casite="uploads"}

// Main 
APP.get('/', function (req, res) {res.sendFile(PATH.join(__dirname,"client","casbah.html"));})

// File server - images, libraries, jquery, bootstrap etc
APP.use(EXPRESS.static(__dirname))
if (__dirname!=global.appRoot) {APP.use(EXPRESS.static(global.appRoot))}

const { typeDefs, resolvers } = require(PATH.join(__dirname,"server","caschema"))


APP.use('/graphql', GRAPHQL_HTTP({
  schema: buildSchema(typeDefs),
  rootValue: resolvers,
  graphiql: true,
}));

APP.listen(4000, function(){
	console.log('Casbah site... http://localhost:4000')
	console.log('Casbah query playground... http://localhost:4000/graphql')
});
