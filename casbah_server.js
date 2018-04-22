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
const express = require("express")
const path = require("path")
const fs = require("fs")
const fsp = require(path.join(__dirname,"server","fs+"))
const url = require("url")
//const sqlite=require("sqlite3").verbose()
const casbahdat = require(path.join(__dirname,"server","casbahdat.js"))
const bodyParser = require("body-parser") 
//const strmod=require("./server/strmod.js")
const fileUpload = require("express-fileupload")

const app = express()
global.appRoot = path.resolve(__dirname);

//Database setup
casbahdat.init();
process.on("exit", casbahdat.close)

//Main entry
app.get('/', function (req, res) {res.sendFile(path.join(__dirname,"views","casbah.html"));})

//File server
app.use(express.static(__dirname));

//Logger
app.use(function(req, res, next){console.log("LOG...",req.url);	next();});

//Middleware parsers for database queries and uploads
app.use( bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 10000}));
app.use( bodyParser.json({limit: '50mb'}));

//Database queries
app.post('/database', casbahdat.query);

//Uploader
app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 }}));

//Routes for various reports
app.post(
	"/deficiencySheets", 
	require(path.join(__dirname,"server","reports.js")).deficiencySheets
);
app.post(
	"/deficiencySheetsLog", 
	require(path.join(__dirname,"server", "reports.js")).deficiencySheetsLog
);



//Start serving...
app.listen(8080, function () {console.log("casbah serving on http://localhost:8080/")});


