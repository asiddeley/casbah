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
const fsp = require(path.join(__dirname,"fs+"))


//const projects_dir="uploads"
const folder_jsonfile="__folderData.json"
const folder_json={
	datafile:"name of datafile",
	description:"describes type of folder",
	folder_type:"SVR",
	icon:"imagename",
	name:"PROJ-001",			
	template:"template.html",
	xdata:"none"
}

//////////////////////
// EXPORTS

exports.select=function(req, res){
	
	var r={folder_path:"", folders:[], files:[], err:null} 
	try{
		if (typeof req.body.folder_path == "undefined" || req.body.folder_path==""){
			r.folder_path=path.join(req.body.uploads_dir, req.body.project_id)
		} 
		else {r.folder_path=req.body.folder_path} 
		console.log("FOLDER SELECT try...", r.folder_path)
		r.folders=fsp.getDirsSync(r.folder_path) //)path.join(global.appRoot,
		r.files=fsp.getFilesSync(r.folder_path)
 		res.json(r)
	}
	catch(e){
		r.err=e
		res.json(r); 
		console.log("FOLDER SELECT catch..", e)
	}
}



/***
case "FOLDERS":
	//reg.body.project_number
	//req.body.tab, 
	//req.body.folder
	console.log("Request for folders in:", root, req.body.tab, req.body.folder);
	try {
		res.json({
			folders:fsp.getDirsSync(path.join(root, req.body.tab, req.body.folder)),
			project_id:req.body.project_id
		});
	} 
	catch(err) {
		console.log(err);
		res.json({
			folders:[], 
			err:err, 
			project_id:req.body.project_id
		});
	}
break;
*/