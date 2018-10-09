/*******************************************************
CASBAH * Contract Admin System Be Architectural Heroes *


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

/////////////////////////////////
// folder 
// server side component

// Node modules
const path = require("path")
const fs = require("fs")
const fsp = require(path.join(__dirname,"fs+"))
const fsx = require("fs-extra")



// exports
exports.select=function(req, res){
	
	var r={folder_path:"", folders:[], files:[], err:null, casbah_type:{}} 
	try{
		if (typeof req.body.folder_path == "undefined" || req.body.folder_path==""){
			r.folder_path=path.join(req.body.uploads_dir, req.body.project_id)
		} 
		else {r.folder_path=req.body.folder_path} 
		console.log("FOLDER SELECT try...", r.folder_path)
		r.folders=fsp.getDirsSync(r.folder_path) //)path.join(global.appRoot,
		r.files=fsp.getFilesSync(r.folder_path)
		//r.folder_type=folder_type(r);
 		res.json(r)
	}
	catch(e){
		r.err=e
		res.json(r); 
		console.log("FOLDER SELECT catch..", e)
	}
}
