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
const fsp=require(__dirname+"\\server\\fs+")
const url = require('url')
const path = require('path')
const sqlite=require('sqlite3').verbose()
const bodyParser=require("body-parser") 
//const strmod=require("./server/strmod.js")
const fileUpload = require('express-fileupload')


const app = express()
global.appRoot = path.resolve(__dirname);

//Open database
const db=new sqlite.Database(path.join(__dirname,"database","casbah.db"))
//var databasecount=1

process.on("exit", function(){db.close();console.log("Database closed.");})


//Main entry
app.get('/', function (req, res) {res.sendFile(path.join(__dirname + "/views/casbah.html"));})

//Static file server.  Use '../' to get parent path
//app.use(express.static(path.join(__dirname)));
app.use(express.static(__dirname));

//Logger
app.use(function(req, res, next){console.log("LOG...",req.url);	next();});

//Database form handler and middleware parsers
app.use( bodyParser.urlencoded({extended: true}));
app.use( bodyParser.json());

app.post('/database', function (req, res) {

	const rows=[]	
	//databasecount+=1
	const sql=req.body.SQL
	try {
		db.serialize( function () {
			db.all(sql, function(err, rows){
				console.log("SQL:",sql)
				var stat=(err==null)?"OK":"Error - "+err
				//console.log("database query#"+databasecount.toString() + " " + stat)
				res.json({err:err, rows:rows})
			})		
		})
	} 
	catch(err) {console.log("SQLITE ERROR...", err)}

})

app.post('/deficiencySheets', require(__dirname+"\\server\\reports").deficiencySheets);
app.post('/deficiencySheetsLog', require(__dirname+"\\server\\reports").deficiencySheetsLog);


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


