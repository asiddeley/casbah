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
const projects_datafile="__projects.json"
const projects_defrow={
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
	var r={dirs:[{dir:"", jsonfile:"", jsontext:""}], defrow:projects_defrow} 
	console.log("PROJECTS select:", p);
	fs.stat(p, function(err, stat){
		if (!err){
			//important, set project_id = dir
			projects_defrow.project_id=req.body.uploads_dir
			//get result array rar=[{dir:"name", jsontext:"{...}", jsonfile:"filename"},...]
			var rar=fsp.dirSync_json(p, projects_datafile, projects_defrow)
			//convert jsontext to object in result
			for (var i in rar){
				try{rar[i]=Object.assign(rar[i], JSON.parse(rar[i].jsontext))}
				catch(err){rar[i].errm=err.message}
			}
			//include dirs field... {dirs:rar, defrow:{}}
			r.dirs=rar
 			res.json(r)
			console.log("PROJECTS success")
		} 
		else {res.json(r); console.log("PROJECTS error:", err.code)}
	})
}

