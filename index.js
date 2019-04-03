/**********************************
CASBAH 
Contract Admin Site Be Architectural Heroes
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
const path = require("path")
const fs = require("fs")
const fsp = require(path.join(__dirname,"server","fs+"))
const url = require("url")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
//const casite = require(path.join(__dirname, "server", "casite.js"))
const casite = require(path.join(__dirname, "server", "caserver.js"))

const app = express()
if (typeof global.appRoot=="undefined") {global.appRoot=path.resolve(__dirname)}

// Site path
// DEP 
if (typeof global.uploads_dir=="undefined") {global.uploads_dir="uploads"}
// NEW
if (typeof global.casite=="undefined") {global.casite="uploads"}


// Main entry
app.get('/', function (req, res) {res.sendFile(path.join(__dirname,"client","casbah.html"));})

// File server
app.use(express.static(__dirname))
if (__dirname!=global.appRoot) {app.use(express.static(global.appRoot))}

// Logger
app.use(function(req, res, next){console.log("LOG...",req.url);	next();});

// Middleware parsers for database queries and uploads
app.use( bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 10000}));
app.use( bodyParser.json({limit: '50mb'}));

// Uploader
app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 }}));

// Server Filesystem Routes 
// DEP
app.post("/uploads", casite.handler);
// NEW
app.post("/casite", casite.handler);


// Start serving...
app.listen(8080, function () {console.log("casbah serving on http://localhost:8080/")});


