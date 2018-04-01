/**********************************
CASBAH * Contract Admin Site * Be Architectural Heroes


MIT License

Copyright (c) 2018 Andrew Siddeley

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
const express = require('express')
const fs = require('fs')
const url = require('url')
const path = require('path')
const sqlite=require('sqlite3').verbose()
const bodyParser=require("body-parser") 
//const strmod=require("./server/strmod.js")
const fileUpload = require('express-fileupload')

const app = express()

const dbname="casbah.db"
const dirdb = __dirname + '/database'
const dirup = __dirname + '/uploads'
const dircd = __dirname + '/uploads/contractDocs'
const dirphoto = __dirname + '/uploads/photos'
const dirwiki = __dirname + '/uploads/wiki'
//Create directories if not already
try {fs.mkdirSync(dirdb, 0744); console.log("Created: "+dirdb);}catch(er){console.log("Dir OK")}
try {fs.mkdirSync(dirup, 0744); console.log("Created: "+dirup);}catch(er){console.log("Dir OK")}
try {fs.mkdirSync(dircd, 0744); console.log("Created: "+dirpcd);}catch(er){console.log("Dir OK")}
try {fs.mkdirSync(dirphoto, 0744); console.log("Created: "+dirphoto);}catch(er){console.log("Dir OK")}
try {fs.mkdirSync(dirwiki, 0744); console.log("Created: "+dirwiki);}catch(er){console.log("Dir OK")}


//Open database
const db=new sqlite.Database(dirdb + "/" + dbname)
var databasecount=1

process.on("exit", function(){db.close();console.log("Database closed.");})


//Main entry
app.get('/', function (req, res) {res.sendFile(path.join(__dirname + "/views/casbah.html"));})

//Static file server.  Use '../' to get parent path
app.use(express.static(path.join(__dirname)));

//Logger
app.use(function(req, res, next){console.log("LOG...",req.url);	next();});

//Database form handler and required middleware parsers
app.use( bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json());

app.post('/database', function (req, res) {

	const rows=[]	
	databasecount+=1
	const sql=req.body.SQL
	//console.log("SQLs to process...", sqls.length)
	
	//console.log("SQLs...", sqls);
	try {
		db.serialize( function () {
			//this substitution may be redundant since already done client side
			//db.all(strmod.substitute(sql, req.body), function(err, rows){
			db.all(sql, function(err, rows){
				console.log("SQL:",sql)
				var stat=(err==null)?"OK":"Error - "+err
				console.log("database query#"+databasecount.toString() + " " + stat)
				res.json({err:err, rows:rows})
			})		
		})
	} 
	catch(err) {console.log("SQLITE ERROR...", err)}

})



/////////////////////////// 
// File Upload
app.use(fileUpload());
app.post('/upload', function(req, res) {
	console.log("Uploading files:", JSON.stringify(req.files)); // the uploaded file object
	if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
	// The name of the input field (i.e. "uploadee") is used to retrieve the uploaded file
	let uploadee = req.files.uploadee;
 
	// Use the mv() method to place the file somewhere on your server
	uploadee.mv("./upload/"+uploadee.name, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});


//start serving
app.listen(8080, function () {console.log('casbah serving on port 8080!')});


