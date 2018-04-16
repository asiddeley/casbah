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

********************************/

const fs = require("fs");
const fsp = require(__dirname+"\\fs+");
const path = require("path");


exports.deficiencySheets=function (req, res) {
	const p=path.join(
		global.appRoot, 
		"uploads\\reports\\deficiencySheets",
		req.body.arg
	);
 
	try {
		console.log("Request for deficiencySheets:", p);
		var files=fsp.walkSync(p);
		//remove app root dir from each file, uploads/reports/... part of path
		for (var i=0; i<files.length; i++){
			files[i]=files[i].substring(global.appRoot.length);
		}
		res.json({files:files});
	} 
	catch(err) {console.log(err); }
}

exports.deficiencySheetsLog=function (req, res) {
	//what about project?
	const p=path.join(global.appRoot,"uploads\\reports\\deficiencySheets");
	
	switch (req.body.action){
	case "ADD":
		console.log("Request to add deficiencySheets dir to:", p);
		try {fs.mkdirSync(path.join(p, req.body.arg));res.json({dirs:fsp.getDirsSync(p)});}
		catch(err) {console.log(err);res.json({dirs:fsp.getDirsSync(p), err:err}); }; 
	break;	
	case "DIRS":
		console.log("Request for deficiencySheetsLog:", p);
		try {res.json({dirs:fsp.getDirsSync(p)});} 
		catch(err) {console.log(err);res.json({dirs:[], err:err}); }; 
	break;
	}
}