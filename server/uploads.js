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


//////////////////////////////////////////////////////////////////////////////

exports.handler=function (req, res) {
	//Prerequisites (to be passed in ajax data):
	//req.body.action... ADD, DIR, FILES, UPLOAD, 
	//req.body.project_number... 
	//req.body.tab... Gallery | reports
	//req.body.folder... Collection | deficiency Sheet set
	//req.body.subfolder... 2018-04-27 photos | level-04
	//req.body.extension
	//req.files... populated by middle-ware from ajaxed formData
	var project_number=req.body.project_number;
	if (typeof project_number == "undefined") {
		console.log("Upload handler error: project_number undefined"); 
		return;
	}
	const root=path.join(global.appRoot,"uploads", req.body.project_number);

	switch (req.body.action){

	case "ADD":
		//prerequisites: 
		//reg.body.project_number
		//req.body.tab, 
		//req.body.folder
		//req.body.subfolder
		console.log("Request to add:", req.body.subfolder);
		console.log("to:", path.join(root, req.body.tab, req.body.folder));
		try {
			fs.mkdirSync(path.join(root, req.body.tab, req.body.folder, req.body.subfolder));
			res.json({
				dirs:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
				project_number:req.body.project_number
			});
		}
		catch(err) {
			console.log(err);
			res.json({
				dirs:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
				err:err,
				project_number:req.body.project_number
			})
		} 
	break;
	
	case "DIR":
		//prerequisites: req.body.report_type
		console.log("Request for log:", root, req.body.tab, req.body.folder);
		try {
			res.json({
				dirs:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
				project_number:req.body.project_number
			});
		} 
		catch(err) {
			console.log(err);
			res.json({
				dirs:[], 
				err:err, 
				project_number:req.body.project_number
			});
		}
	break;
	
	case "FILES":
		//Prerequisites
		//req.body.project_number
		//req.body.tab
		//req.body.folder
		//req.body.extension... ".jpg .pgn .bmp"
		try {
			console.log("Request for files in:", path.join(root, req.body.tab, req.body.folder))
			var files=fsp.walkSync(path.join(
				root, 
				req.body.tab, 
				req.body.folder,
				req.body.subfolder
			));
			var filtered_files=[]
			var ext
			//remove app root dir from each file, uploads/reports/... part of path
			for (var i=0; i<files.length; i++){
				ext=path.extname(files[i]).toUpperCase()
				//if (ext == ".PNG" || ext==".JPG"){
				if (req.body.extension.toUpperCase().indexOf(ext)!=-1){	
					//files[i]=files[i].substring(global.appRoot.length)
					filtered_files.push(files[i].substring(global.appRoot.length))
				}
			}
			res.json({
				files:filtered_files,
				project_number:req.body.project_number,
				folder:req.body.folder,
				subfolder:req.body.subfolder
			})
		} 
		catch(err) {
			console.log(err)
			res.json({
				files:[], 
				err:err,
				project_number:req.body.project_number,
				folder:req.body.folder,
				subfolder:req.body.subfolder
			})
		}
	break;
	
	case "project_numbers":
		console.log("Request for project numbers:", root);
		
		try {
			var ro={};
			var bin=(typeof req.body.backin =="undefined")?"dirs":req.body.backin;
			//getDirsSync returns an array of folders.  Each is just a short name, not path
			ro[bin]=fsp.getDirsSync(root);
			res.json(ro);
		} 
		catch(err) {
			console.log(err);
			res.json({dirs:[],err:err});
		}	
		break;	
	
	case "UPLOAD":
		if (!req.files) {console.log("Missing files for upload"); break;}
		console.log("Upload request file(s):", Object.keys(req.files))
		console.log("TO:", path.join(root, req.body.tab, req.body.folder, req.body.subfolder))
		try {
			var dest, file;
			for (var f in req.files){
				file=req.files[f]
				dest=path.join(root, req.body.tab, req.body.folder, req.body.subfolder, req.body.file.name)
				//.mv function added by 'express-fileupload' middleware
				file.mv(dest, function(err) {
					if (err) {console.log ("Failed to move:", dest, JSON.stringify(err))} 
					else {console.log ("File uploaded as:", dest)}
				})
			}			
		}
		catch(err) {console.log(err);res.json({dirs:[], err:err}) }	
	break; 	
	
	}
	
}

