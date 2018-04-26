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

const path = require("path")
const fs = require("fs")
const fsp = require(path.join(global.appRoot,"server","fs+"))
const fileUpload = require('express-fileupload')


exports.deficiencySheets=function (req, res) {
	
	var name=req.body.deficiencySheetsName
	const p=path.join(global.appRoot,"uploads","reports","deficiencySheets", name)
 
	try {
		console.log("deficiencySheets request for images in:", name)
		var files=fsp.walkSync(p)
		var images=[]
		var ext
		//remove app root dir from each file, uploads/reports/... part of path
		for (var i=0; i<files.length; i++){
			ext=path.extname(files[i]).toUpperCase()
			if (ext == ".PNG" || ext==".JPG"){
				//files[i]=files[i].substring(global.appRoot.length)
				images.push(files[i].substring(global.appRoot.length))
			}
		}
		//res.json({files:files})
		res.json({images:images})
	} 
	catch(err) {console.log(err)}
}

exports.deficiencySheetsLog=function (req, res) {
	//what about project?
	const p=path.join(global.appRoot,"uploads","reports","deficiencySheets")
	//UPLOAD
	if (req.files){
		console.log("Upload file(s):", Object.keys(req.files))
		console.log("to folder:", req.body.deficiencySheetsName)
		try {
			var dest, file;
			for (var f in req.files){
				file=req.files[f]
				dest=path.join(p, req.body.deficiencySheetsName, file.name)
				//mv method added by app.use(fileUpload())
				file.mv(dest, function(err) {
					if (err) {
						console.log ("failed to move:", dest)
						//return res.status(500).send(err)
						//res.json({status:"failed to upload:"+file.name})
					} 
					else {
						//res.send('File uploaded!')
						console.log ("file uploaded as:", dest)
						//res.json({status:"Success uploading:"+file.name})
					}
				})
			}			
		}
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }	
	} 
	//ADD sheetset ie create new folder on server 
	else if (req.body.action == "ADD"){
		console.log("Request to add defic Sheetset to:", p)
		try {fs.mkdirSync(path.join(p, req.body.arg)); res.json({dirs:fsp.getDirsSync(p)})}
		catch(err) {console.log(err);res.json({dirs:fsp.getDirsSync(p), err:err}) } 
	}
	//DIRS return list of sheetsets or folders
	else if (req.body.action == "DIRS"){
		console.log("Request for Sheetsets Log:", p)
		try {res.json({dirs:fsp.getDirsSync(p)})} 
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }
	}
}

//////////////////////////////////////////////////////////////////////////////

exports.handler=function (req, res) {
	//what about project?
	var pnum=req.body.project_number;
	const reports_root=path.join(global.appRoot,"uploads",pnum,"reports");

	switch (req.body.action){

	case "UPLOAD":
		if (!req.files) {console.log("Missing files for upload"); break;}
		//prerequisites: req.body.report_type, req.body.report_name
		console.log("Request to upload file(s):", Object.keys(req.files))
		console.log("to:", report_root, req.report_type, req.report_name)
		try {
			var dest, file;
			for (var f in req.files){
				file=req.files[f]
				dest=path.join(reports_root, req.body.report_type, req.body.report_name, file.name)
				//mv method added by app.use(fileUpload())
				file.mv(dest, function(err) {
					if (err) {console.log ("Failed to move:", dest)} 
					else {console.log ("File uploaded as:", dest)}
				})
			}			
		}
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }	
	break; 
	
	case "ADD":
		//prerequisites: req.body.report_type, req.body.report_name
		console.log("Request to add:", req.body.report_name);
		console.log("to:", report_root, req.report_type);
		try {
			fs.mkdirSync(path.join(reports_root, req.body.report_type, req.body.report_name));
			res.json({dirs:fsp.getDirsSync(path.join(reports_root, req.body.report_type))});
		}
		catch(err) {console.log(err);res.json({dirs:fsp.getDirsSync(p), err:err}) } 
	break;
	
	case "LOG":
		//prerequisites: req.body.report_type
		console.log("Request for a report log of:", report_root, req.report_type);
		try {
			res.json( {dirs:fsp.getDirsSync(path.join(report_root, report_type))});
		} 
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }
	break;
	
	case "IMAGES":
		//var name=req.body.deficiencySheetsName
		//const p=path.join(global.appRoot,"uploads","reports","deficiencySheets", name)
 
		try {
			
			
			console.log("deficiencySheets request for images in:", name)
			var files=fsp.walkSync(p)
			var images=[]
			var ext
			//remove app root dir from each file, uploads/reports/... part of path
			for (var i=0; i<files.length; i++){
				ext=path.extname(files[i]).toUpperCase()
				if (ext == ".PNG" || ext==".JPG"){
					//files[i]=files[i].substring(global.appRoot.length)
					images.push(files[i].substring(global.appRoot.length))
				}
			}
			res.json({images:images})
		} 
		catch(err) {console.log(err)}
	break;
	}
	
}

