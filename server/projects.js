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

//const projects_dir="uploads"
const projects_jsonfile="__projects.json"
const projects_json={
	project_id:"PROJ-001",			
	project_name:"The Casbah Building",
	address:"101 Desert Way, The Ville, RTC-RTC",
	owner:"Owner", 
	contractor:"CasbahCon",
	permit:"16 xxxxxx BLD 00 BA",
	date:"2018-May-10", //Date(),
	date_closed:"none",
	status:"status",
	xdata:"none"
}

//////////////////////
// EXPORTS
exports.change=function(req, res){}

exports.idlist=function(req, res){
	//Returns a list of project folders
	var p=path.join(global.appRoot, req.body.uploads_dir)
	console.log("PROJECT-IDLIST:", p);
	try {
		//getDirsSync returns an array of folders.  Each is just a short name, not path
		var ids=fsp.getDirsSync(p);
		res.json({ids:ids});
	}
	catch(err) {
		console.log("PROJECTS err", err);
		res.json({ids:[]});
	}	
}
exports.insert=function(req, res){}
exports.remove=function(req, res){}
exports.select=function(req, res){
	
	//select all projects with suplementary data
	var p=path.join(global.appRoot, req.body.uploads_dir);
	//empty result
	var r={projects:[{dir:"", jsonfile:"", jsontext:"", project_id:""}], json:projects_json} 
	console.log("PROJECT select:");
	fs.stat(p, function(err, stat){
		if (!err){
			//if req.body.project_id is undefined then all info for all projects returned
			var rar=fsp.dirSync_json(p, projects_jsonfile, projects_json, req.body.project_id)
			rar=fsp.jsonify(rar)
			r.projects=fsp.dirasid(rar, "project_id")		
 			res.json(r)
			console.log("PROJECTS success")
		}
		else {res.json(r); console.log("PROJECTS error:", err.code)}
	})
}

