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
//const fsp = require(path.join(global.appRoot,"server","fs+"))
const fsp = require(path.join(__dirname,"fs+"))
const fsx=require("fs-extra")

//const projects_dir="uploads"
const project_jsonfile="__projectData.json"
const project_json={
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

/**** not required, folders made as required elsewhere
const project_struct=[
"projects",
path.join("projects", "actions"),
path.join("projects", "billing"),
path.join("projects", "contract"),
path.join("projects", "gallery"),
path.join("projects", "letters"),
path.join("projects", "meetings"),
path.join("projects", "reports"),
path.join("projects", "reports", "site reviews"),
path.join("projects", "shops"),
path.join("projects", "welcome"),
]
*/

//////////////////////
// EXPORTS
exports.change=function(req, res){
	var p, field, valu, stat, json

	try{
		p=path.join(
			global.appRoot, 
			req.body.uploads_dir, 
			req.body.project_id, 
			project_jsonfile
		)
		field=req.body.field
		valu=req.body.valu
		stat="OK"
		console.log("PROJECT CHANGE:", field, " VALUE TO:",valu, " IN:", p)	
		json=JSON.parse(fs.readFileSync(p))
		json[field]=valu
		fs.writeFileSync(p,JSON.stringify(json))
	}
	catch(err) {
		stat=err
		console.log("PROJECT_CHANGE Catch:",err)
	} 
	finally {
		var result={data:[json],stat:stat}
		res.json(result);
		console.log("PROJECT_CHANGE finally:", result)
	}
}

exports.idlist=function(req, res){
	//Returns a list of project folders
	try {
		var p=path.join(global.appRoot, req.body.uploads_dir)
		console.log("PROJECT-IDLIST:", p)		
		//getDirsSync returns an array of folders.  Each is just a short name, not path
		var ids=fsp.getDirsSync(p);
		res.json({ids:ids});
	}
	catch(err) {
		console.log("PROJECTS err", err);
		res.json({ids:[]});
	}	
}

exports.insert=function(req, res){
	var err=null, p
	try {
		console.log("PROJECT INSERT Try...")
		//Make a new project folder...
		p=path.join(global.appRoot, req.body.uploads_dir, req.body.project_id)
		//fs.mkdirSync(p)
		fsx.ensureDirSync(p)
		console.log("PROJECT INSERT Created folder:",p)
		res.json({msg:"Project created", err:err});
	}
	catch(e) {	
		err=e
		res.json({err:err});
		console.log("PROJECT INSERT CATCH:",err)	
	} 
}


exports.remove=function(req, res){}
exports.select=function(req, res){
	
	//select all projects with suplementary data
	var p=path.join(global.appRoot, req.body.uploads_dir);
	//empty result
	var r={projects:[{dir:"", jsonfile:"", jsontext:"", project_id:""}], json:project_json} 
	console.log("PROJECT select:");
	fs.stat(p, function(err, stat){
		if (!err){
			//if req.body.project_id is undefined then all info for all projects returned
			var rar=fsp.dirSync_json(p, project_jsonfile, project_json, req.body.project_id)
			rar=fsp.jsonify(rar)
			r.projects=fsp.dirasid(rar, "project_id")		
 			res.json(r)
			console.log("PROJECT select success")
		}
		else {res.json(r); console.log("PROJECT select error:", err.code)}
	})
}


//////////////
//NEW with req.body.path instead of req.body.project_id
exports.__select=function(req, res){
	
	//select all projects with suplementary data
	var p=path.join(global.appRoot, req.body.uploads_dir);
	//empty result
	var r={projects:[{dir:"", jsonfile:"", jsontext:"", project_id:""}], json:project_json} 
	console.log("PROJECT select:");
	fs.stat(p, function(err, stat){
		if (!err){
			//if req.body.project_id is undefined then all info for all projects returned
			var rar=fsp.dirSync_json(p, project_jsonfile, project_json, req.body.project_id)
			rar=fsp.jsonify(rar)
			r.projects=fsp.dirasid(rar, "project_id")		
 			res.json(r)
			console.log("PROJECT select success")
		}
		else {res.json(r); console.log("PROJECT select error:", err.code)}
	})
}
